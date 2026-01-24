class ResponseFormatter {
    format(output, taskType) {
        let formatted = '';

        // Add title
        formatted += output.title + '\n\n';

        // Add sections in order
        for (let [sectionName, sectionContent] of Object.entries(output.sections)) {
            if (sectionContent && sectionContent.trim() !== '') {
                formatted += sectionContent + '\n\n';
            }
        }

        // Add metadata
        formatted += this.formatMetadata(output.metadata);

        return {
            raw: output,
            formatted: formatted,
            html: this.formatToHTML(output),
            markdown: formatted,
            timestamp: output.timestamp
        };
    }

    formatToHTML(output) {
        let html = `<div class="nuvora-response">`;
        html += `<h1>${output.title}</h1>`;
        
        for (let [sectionName, sectionContent] of Object.entries(output.sections)) {
            if (sectionContent && sectionContent.trim() !== '') {
                html += this.markdownToHTML(sectionContent);
            }
        }
        
        html += `</div>`;
        return html;
    }

    markdownToHTML(markdown) {
        return markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\n/gim, '<br>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    }

    formatMetadata(metadata) {
        return `---\n` +
               `Research Time: ${metadata.researchTime.toLocaleString()}\n` +
               `Task Complexity: ${metadata.taskComplexity}\n` +
               `Sources: ${metadata.sourcesCount}\n` +
               `---\n`;
    }
}

module.exports = ResponseFormatter;