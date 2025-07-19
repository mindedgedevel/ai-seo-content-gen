// SEO Article Writer with Gemini AI
class SEOArticleWriter {
  constructor() {
    this.apiKey = '';
    this.initializeElements();
    this.loadSavedApiKey();
    this.loadRecentArticles();
    this.bindEvents();
  }

  initializeElements() {
    this.form = document.getElementById('article-form');
    this.apiKeyInput = document.getElementById('api-key');
    this.topicInput = document.getElementById('topic');
    this.targetAudienceSelect = document.getElementById('target-audience');
    this.keywordsInput = document.getElementById('keywords');
    this.wordCountSelect = document.getElementById('word-count');
    this.generateBtn = document.getElementById('generate-btn');
    this.outputArea = document.getElementById('output-area');
    this.loadingDiv = document.getElementById('loading');
    this.copyBtn = document.getElementById('copy-btn');
    this.errorMessage = document.getElementById('error-message');
    this.successMessage = document.getElementById('success-message');
    this.copyMessage = document.getElementById('copy-message');
    this.recentArticlesContainer = document.getElementById('recent-articles');
    this.clearRecentBtn = document.getElementById('clear-recent-btn');
    this.resetBtn = document.getElementById('reset-btn');
  }

  loadSavedApiKey() {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      this.apiKeyInput.value = savedApiKey;
      this.apiKey = savedApiKey;
    }
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.apiKeyInput.addEventListener('input', (e) =>
      this.handleApiKeyChange(e)
    );
    this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    this.clearRecentBtn.addEventListener('click', () =>
      this.clearRecentArticles()
    );
    this.resetBtn.addEventListener('click', () => this.resetForm());
  }

  handleApiKeyChange(e) {
    this.apiKey = e.target.value;
    if (this.apiKey) {
      localStorage.setItem('gemini-api-key', this.apiKey);
      this.showSuccess('API Key ถูกบันทึกแล้ว');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.showLoading();
    this.hideMessages();

    try {
      const article = await this.generateArticle();
      this.displayArticle(article);
      this.saveRecentArticle(article);
      this.showSuccess('สร้างบทความสำเร็จ!');
    } catch (error) {
      this.showError(`เกิดข้อผิดพลาด: ${error.message}`);
      console.error('Error:', error);
    } finally {
      this.hideLoading();
    }
  }

  validateForm() {
    if (!this.apiKey.trim()) {
      this.showError('กรุณาใส่ API Key');
      return false;
    }

    if (!this.topicInput.value.trim()) {
      this.showError('กรุณาใส่หัวข้อบทความ');
      return false;
    }

    if (!this.targetAudienceSelect.value) {
      this.showError('กรุณาเลือกกลุ่มเป้าหมาย');
      return false;
    }

    return true;
  }

  async generateArticle() {
    const topic = this.topicInput.value.trim();
    const targetAudience = this.getTargetAudienceText();
    const keywords = this.keywordsInput.value.trim();
    const wordCount = this.getWordCountText();

    const prompt = this.buildPrompt(topic, targetAudience, keywords, wordCount);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || 'ไม่สามารถเชื่อมต่อกับ Gemini API ได้'
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error('ไม่ได้รับการตอบกลับจาก AI');
    }

    return data.candidates[0].content.parts[0].text;
  }

  buildPrompt(topic, targetAudience, keywords, wordCount) {
    let prompt = `สร้างบทความ SEO ภาษาไทยที่มีคุณภาพสูงเกี่ยวกับหัวข้อ: "${topic}"

กลุ่มเป้าหมาย: ${targetAudience}
ความยาวบทความ: ${wordCount}`;

    if (keywords) {
      prompt += `\nคำสำคัญที่ต้องใส่: ${keywords}`;
    }

    prompt += `

กรุณาสร้างบทความที่มีโครงสร้างดังนี้:

1. หัวข้อหลักที่น่าสนใจและเหมาะกับ SEO
2. บทนำที่ดึงดูดความสนใจ
3. เนื้อหาหลักแบ่งเป็นหัวข้อย่อยที่ชัดเจน
4. ใช้ H2, H3 สำหรับหัวข้อย่อย
5. เนื้อหาที่มีประโยชน์และตอบโจทย์ผู้อ่าน
6. สรุปที่กระชับและมีการเรียกร้องให้ดำเนินการ (Call-to-Action)

ข้อกำหนดเพิ่มเติม:
- ใช้ภาษาไทยที่เข้าใจง่าย
- เหมาะสมกับกลุ่มเป้าหมาย
- มีการกระจายคำสำคัญอย่างเป็นธรรมชาติ
- เนื้อหาต้องมีคุณค่าและไม่ซ้ำใคร
- ใช้รูปแบบ Markdown สำหรับการจัดรูปแบบ

เริ่มสร้างบทความ:`;

    return prompt;
  }

  getTargetAudienceText() {
    const audienceMap = {
      beginners: 'ผู้เริ่มต้นที่ต้องการเรียนรู้พื้นฐาน',
      intermediate: 'ผู้ที่มีความรู้ระดับกลาง',
      advanced: 'ผู้เชี่ยวชาญที่ต้องการความรู้เชิงลึก',
      'business-owners': 'เจ้าของธุรกิจที่ต้องการเพิ่มยอดขาย',
      marketers: 'นักการตลาดที่ต้องการเครื่องมือและกลยุทธ์',
      developers: 'นักพัฒนาที่ต้องการความรู้ทางเทคนิค',
      students: 'นักเรียนและนักศึกษาที่ต้องการความรู้เพื่อการศึกษา',
      general: 'ผู้อ่านทั่วไปที่สนใจในหัวข้อนี้',
    };
    return audienceMap[this.targetAudienceSelect.value] || 'ผู้อ่านทั่วไป';
  }

  getWordCountText() {
    const wordCountMap = {
      short: '300-500 คำ',
      medium: '800-1200 คำ',
      long: '1500-2000 คำ',
    };
    return wordCountMap[this.wordCountSelect.value] || '800-1200 คำ';
  }

  displayArticle(article) {
    // First convert list items (before other formatting)
    let formattedArticle = this.convertListItems(article);

    // Then apply other markdown formatting
    formattedArticle = formattedArticle
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<h[1-6]>|<\/p>|<p>|<ul>|<\/ul>|<li>)(.*$)/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p>(<ul>.*<\/ul>)<\/p>/gs, '$1')
      .replace(/<p>(<li>.*<\/li>)<\/p>/g, '$1');

    // Clear the placeholder content
    this.outputArea.innerHTML = '';

    // Add the formatted article with smooth reveal animation
    this.outputArea.innerHTML = formattedArticle;

    // Add reading time estimation
    this.addReadingTime(article);

    // Enhance readability
    setTimeout(() => {
      this.enhanceReadability();
    }, 100);

    // Smooth scroll to top of article
    this.outputArea.scrollTop = 0;

    this.copyBtn.classList.remove('hidden');
  }

  addReadingTime(article) {
    const words = article.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute

    const readingTimeElement = document.createElement('div');
    readingTimeElement.className =
      'text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200 flex items-center justify-between';
    readingTimeElement.innerHTML = `
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
        </svg>
        เวลาอ่าน: ${readingTime} นาที
      </div>
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"/>
        </svg>
        จำนวนคำ: ${words} คำ
      </div>
    `;

    this.outputArea.insertBefore(
      readingTimeElement,
      this.outputArea.firstChild
    );
  }

  convertListItems(text) {
    // Split text into lines
    const lines = text.split('\n');
    let result = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Check if line starts with * or - (list item)
      if (/^[\*\-]\s+(.+)/.test(trimmedLine)) {
        const listContent = trimmedLine.replace(/^[\*\-]\s+/, '');

        if (!inList) {
          // Start new list
          result.push('<ul>');
          inList = true;
        }

        result.push(`  <li>${listContent}</li>`);
      } else {
        // Not a list item
        if (inList) {
          // Close current list
          result.push('</ul>');
          inList = false;
        }

        // Add non-empty lines
        if (trimmedLine.length > 0) {
          result.push(line);
        } else if (!inList) {
          // Preserve empty lines when not in a list
          result.push('');
        }
      }
    }

    // Close list if still open
    if (inList) {
      result.push('</ul>');
    }

    return result.join('\n');
  }

  enhanceReadability() {
    // Add table of contents if there are multiple headings
    const headings = this.outputArea.querySelectorAll('h2, h3');
    if (headings.length > 2) {
      this.addTableOfContents(headings);
    }

    // Add smooth scroll behavior to internal links
    this.addSmoothScrolling();
  }

  addTableOfContents(headings) {
    const toc = document.createElement('div');
    toc.className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6';
    toc.innerHTML =
      '<h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center"><svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>สารบัญ</h3>';

    const tocList = document.createElement('ul');
    tocList.className = 'space-y-2';

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      const li = document.createElement('li');
      li.className = heading.tagName === 'H2' ? 'ml-0' : 'ml-4';
      li.innerHTML = `<a href="#${id}" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">${heading.textContent}</a>`;
      tocList.appendChild(li);
    });

    toc.appendChild(tocList);

    // Insert TOC after reading time
    const readingTime = this.outputArea.querySelector('.text-sm.text-gray-500');
    if (readingTime) {
      readingTime.parentNode.insertBefore(toc, readingTime.nextSibling);
    }
  }

  addSmoothScrolling() {
    const links = this.outputArea.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  async copyToClipboard() {
    try {
      const text = this.outputArea.innerText;
      await navigator.clipboard.writeText(text);
      this.showSuccess('คัดลอกบทความเรียบร้อยแล้ว!');
      this.copySuccess('คัดลอกบทความเรียบร้อยแล้ว!');
    } catch (error) {
      this.showError('ไม่สามารถคัดลอกได้');
    }
  }

  showLoading() {
    this.loadingDiv.classList.remove('hidden');
    this.outputArea.classList.add('hidden');
    this.generateBtn.disabled = true;
    this.copyBtn.classList.add('hidden');
  }

  hideLoading() {
    this.loadingDiv.classList.add('hidden');
    this.outputArea.classList.remove('hidden');
    this.generateBtn.disabled = false;
  }

  showError(message) {
    document.getElementById('error-text').textContent = message;
    this.errorMessage.classList.remove('hidden');
    this.successMessage.classList.add('hidden');
    setTimeout(() => this.hideMessages(), 5000);
  }

  showSuccess(message) {
    document.getElementById('success-text').textContent = message;
    this.successMessage.classList.remove('hidden');
    this.errorMessage.classList.add('hidden');
    setTimeout(() => this.hideMessages(), 3000);
  }

  copySuccess(message) {
    document.getElementById('copy-message').textContent = message;
    this.copyMessage.classList.remove('hidden');
    setTimeout(() => this.copyMessage.classList.add('hidden'), 3000);
  }

  hideMessages() {
    this.errorMessage.classList.add('hidden');
    this.successMessage.classList.add('hidden');
  }

  saveRecentArticle(article) {
    const articleData = {
      id: Date.now(),
      title: this.topicInput.value.trim(),
      content: article,
      targetAudience: this.targetAudienceSelect.value,
      keywords: this.keywordsInput.value.trim(),
      wordCount: this.wordCountSelect.value,
      createdAt: new Date().toISOString(),
    };

    let recentArticles = this.getRecentArticles();
    recentArticles.unshift(articleData);

    // Keep only the last 10 articles
    if (recentArticles.length > 10) {
      recentArticles = recentArticles.slice(0, 10);
    }

    localStorage.setItem('recent-articles', JSON.stringify(recentArticles));
    this.loadRecentArticles();
  }

  getRecentArticles() {
    const saved = localStorage.getItem('recent-articles');
    return saved ? JSON.parse(saved) : [];
  }

  loadRecentArticles() {
    const recentArticles = this.getRecentArticles();

    if (recentArticles.length === 0) {
      this.recentArticlesContainer.innerHTML =
        '<div class="text-center text-gray-500 py-8 italic">ยังไม่มีบทความที่สร้างไว้</div>';
      this.clearRecentBtn.classList.add('hidden');
      return;
    }

    this.clearRecentBtn.classList.remove('hidden');

    const articlesHTML = recentArticles
      .map((article) => {
        const date = new Date(article.createdAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const audienceText = this.getAudienceDisplayText(
          article.targetAudience
        );

        return `
        <div class="bg-gradient-light-blue border border-sky-200 rounded-lg p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-blue-500 relative group">
          <div class="cursor-pointer" data-article-id="${article.id}">
            <div class="font-semibold text-blue-800 mb-2 text-sm pr-8">${article.title}</div>
            <div class="flex justify-between items-center text-xs text-gray-600">
              <span class="opacity-80">${date}</span>
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${audienceText}</span>
            </div>
          </div>
          <button class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1" 
                  data-delete-id="${article.id}" 
                  title="ลบบทความนี้">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      `;
      })
      .join('');

    this.recentArticlesContainer.innerHTML = articlesHTML;

    // Add click events to recent items
    this.recentArticlesContainer
      .querySelectorAll('[data-article-id]')
      .forEach((item) => {
        item.addEventListener('click', (e) => {
          const articleId = parseInt(e.currentTarget.dataset.articleId);
          this.loadRecentArticle(articleId);
        });
      });

    // Add click events to delete buttons
    this.recentArticlesContainer
      .querySelectorAll('[data-delete-id]')
      .forEach((button) => {
        button.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent triggering the article load
          const articleId = parseInt(e.currentTarget.dataset.deleteId);
          this.deleteRecentArticle(articleId);
        });
      });
  }

  getAudienceDisplayText(audienceValue) {
    const audienceMap = {
      beginners: 'ผู้เริ่มต้น',
      intermediate: 'ระดับกลาง',
      advanced: 'ระดับสูง',
      'business-owners': 'เจ้าของธุรกิจ',
      marketers: 'นักการตลาด',
      developers: 'นักพัฒนา',
      students: 'นักเรียน/นักศึกษา',
      general: 'ทั่วไป',
    };
    return audienceMap[audienceValue] || 'ทั่วไป';
  }

  loadRecentArticle(articleId) {
    const recentArticles = this.getRecentArticles();
    const article = recentArticles.find((a) => a.id === articleId);

    if (!article) {
      this.showError('ไม่พบบทความที่เลือก');
      return;
    }

    // Fill form with article data
    this.topicInput.value = article.title;
    this.targetAudienceSelect.value = article.targetAudience;
    this.keywordsInput.value = article.keywords || '';
    this.wordCountSelect.value = article.wordCount;

    // Display the article
    this.displayArticle(article.content);
    this.showSuccess('โหลดบทความเรียบร้อยแล้ว!');
  }

  clearRecentArticles() {
    if (confirm('คุณต้องการลบประวัติบทความทั้งหมดหรือไม่?')) {
      localStorage.removeItem('recent-articles');
      this.loadRecentArticles();
      this.showSuccess('ลบประวัติบทความทั้งหมดแล้ว');
    }
  }

  resetForm() {
    // Reset form fields (except API Key)
    this.topicInput.value = '';
    this.targetAudienceSelect.value = '';
    this.keywordsInput.value = '';
    this.wordCountSelect.value = 'medium';

    // Clear output area
    this.outputArea.innerHTML = `
      <div class="text-center text-gray-500 py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
        </svg>
        <p>บทความ SEO ที่สร้างจะแสดงที่นี่...</p>
        <p class="text-sm mt-2">คุณสามารถใส่ API Key ของ Google Gemini และเริ่มสร้างบทความได้เลย!</p>
      </div>
    `;

    // Hide copy button
    this.copyBtn.classList.add('hidden');

    // Hide messages
    this.hideMessages();

    // Focus on topic input
    this.topicInput.focus();

    this.showSuccess('รีเซ็ตฟอร์มเรียบร้อยแล้ว');
  }

  deleteRecentArticle(articleId) {
    if (confirm('คุณต้องการลบบทความนี้หรือไม่?')) {
      let recentArticles = this.getRecentArticles();
      recentArticles = recentArticles.filter(
        (article) => article.id !== articleId
      );
      localStorage.setItem('recent-articles', JSON.stringify(recentArticles));
      this.loadRecentArticles();
      this.showSuccess('ลบบทความเรียบร้อยแล้ว');
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new SEOArticleWriter();

  // Test function for list conversion (for debugging)
  window.testListConversion = function () {
    const testText = `# หัวข้อหลัก

ข้อความปกติ

* รายการที่ 1
* รายการที่ 2
* รายการที่ 3

ข้อความอื่น

- รายการแบบ dash
- อีกรายการหนึ่ง

สิ้นสุด`;

    console.log('Original:', testText);
    console.log('Converted:', app.convertListItems(testText));
  };
});
