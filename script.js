$(document).ready(function() {
    splitContentIntoSections();

    // Refresh the page on resize instead of calling the function directly
    $(window).resize(function() {
        location.reload();
    });
});

function splitContentIntoSections() {
    const content = $('#content').html();
    const words = content.split(' ');
    let sectionContent = '';
    let sections = [];
    let isNewPara = true;
    let currentLine = '';
    let characterCount = 0;
    let lineCount = 0;

    const availableHeight = $(window).height() - parseInt($('body').css('fontSize')) * 2;

    words.forEach(word => {
        let testContent = sectionContent + (isNewPara ? '<p class="para">' : ' ') + word;
        currentLine += (isNewPara ? '' : ' ') + word;

        $('#section0').html(testContent);
        const sectionHeight = $('#section0').height();

        // Check if the word fits in the current line
        if (sectionHeight > availableHeight || (lineCount > 0 && (characterCount / lineCount) - 5 < currentLine.length)) {
            sections.push(sectionContent + '</p>');
            sectionContent = '<p class="continued">' + word;
            isNewPara = false;
            currentLine = word;
            characterCount = 0;
            lineCount = 0;
        } else {
            sectionContent = testContent;
            isNewPara = word.endsWith('</p>');
            if (isNewPara) {
                characterCount += currentLine.length;
                lineCount += 1;
                currentLine = '';
            }
        }
    });

    // Add any remaining content as a new section
    if (sectionContent.length > 0) {
        sections.push(sectionContent);
    }

    // Now create the sections in the DOM
    $('#fullpage').empty();
    sections.forEach((sectionContent, i) => {
        $('#fullpage').append('<div class="section" id="section' + i + '">' + sectionContent + '</div>');
    });

    // Reinitialize FullPage.js
    if (window.fullpage_api) {
        window.fullpage_api.destroy('all');
    }

    $('#fullpage').fullpage({
        verticalCentered: false,
        paddingTop: '2rem',
        paddingBottom: '2rem'
    });
}
