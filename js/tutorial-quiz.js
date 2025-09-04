// Interactive quiz functionality for tutorial pages
class TutorialQuiz {
    constructor() {
        this.init();
    }

    init() {
        this.setupQuizzes();
        this.setupInteractiveElements();
    }

    setupQuizzes() {
        const quizForms = document.querySelectorAll('.quiz-form');
        
        quizForms.forEach((form, index) => {
            const submitBtn = form.querySelector('.quiz-submit');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    this.handleQuizSubmission(form, index);
                });
            }
        });
    }

    handleQuizSubmission(form, quizIndex) {
        const selectedOption = form.querySelector('input[name="q1"]:checked');
        const feedbackContainer = form.querySelector('.quiz-feedback');
        
        if (!selectedOption) {
            this.showFeedback(feedbackContainer, 'Please select an answer.', 'warning');
            return;
        }

        // Quiz answers (in a real app, these would be securely stored)
        const answers = {
            0: 'b' // First quiz answer is option B
        };

        const correctAnswer = answers[quizIndex];
        const isCorrect = selectedOption.value === correctAnswer;

        if (isCorrect) {
            this.showFeedback(
                feedbackContainer, 
                '✅ Correct! SELECT * FROM products; is the right answer. The SELECT statement is used to retrieve data, and the asterisk (*) means "all columns".', 
                'success'
            );
            this.trackEvent('quiz_correct', { 
                quiz: quizIndex, 
                answer: selectedOption.value 
            });
        } else {
            this.showFeedback(
                feedbackContainer,
                '❌ Not quite right. The correct answer is SELECT * FROM products;. Remember, we use SELECT to retrieve data, not GET, RETRIEVE, or SHOW.',
                'error'
            );
            this.trackEvent('quiz_incorrect', { 
                quiz: quizIndex, 
                answer: selectedOption.value,
                correct_answer: correctAnswer
            });
        }

        // Disable further submissions
        const submitBtn = form.querySelector('.quiz-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Answer Submitted';
        
        // Disable all radio buttons
        const radioButtons = form.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => radio.disabled = true);
    }

    showFeedback(container, message, type) {
        container.innerHTML = message;
        container.className = `quiz-feedback ${type}`;
        container.style.display = 'block';
        
        // Style based on type
        const styles = {
            success: {
                backgroundColor: '#d1fae5',
                color: '#065f46',
                borderLeft: '4px solid #10b981'
            },
            error: {
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderLeft: '4px solid #ef4444'
            },
            warning: {
                backgroundColor: '#fef3c7',
                color: '#92400e',
                borderLeft: '4px solid #f59e0b'
            }
        };

        Object.assign(container.style, styles[type]);
        
        // Scroll to feedback
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setupInteractiveElements() {
        this.setupCodeExamples();
        this.setupTryItButtons();
        this.setupProgressTracking();
    }

    setupCodeExamples() {
        // Add "Try It" functionality to code examples
        const codeExamples = document.querySelectorAll('.code-example');
        
        codeExamples.forEach(example => {
            const tryItBtn = example.querySelector('.try-it-btn');
            if (tryItBtn) {
                tryItBtn.addEventListener('click', () => {
                    this.openSQLEditor(example);
                });
            }
        });
    }

    openSQLEditor(codeExample) {
        const code = codeExample.querySelector('code').textContent;
        
        // Create modal for SQL editor
        const modal = this.createSQLEditorModal(code);
        document.body.appendChild(modal);
        
        // Focus on the editor
        const editor = modal.querySelector('.sql-editor');
        editor.focus();
        editor.setSelectionRange(editor.value.length, editor.value.length);
    }

    createSQLEditorModal(initialCode) {
        const modal = document.createElement('div');
        modal.className = 'sql-editor-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        modal.innerHTML = `
            <div class="sql-editor-container" style="
                background: var(--bg-primary);
                border-radius: var(--radius-lg);
                width: 90%;
                max-width: 800px;
                max-height: 90%;
                overflow: hidden;
                box-shadow: var(--shadow-lg);
            ">
                <div class="editor-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-bottom: 1px solid var(--border-color);
                ">
                    <h3 style="margin: 0; color: var(--text-primary);">Try SQL Query</h3>
                    <button class="close-editor" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: var(--text-secondary);
                        cursor: pointer;
                    ">&times;</button>
                </div>
                
                <div class="editor-body" style="padding: 1rem;">
                    <textarea class="sql-editor" style="
                        width: 100%;
                        height: 200px;
                        font-family: var(--font-mono);
                        font-size: 0.875rem;
                        padding: 1rem;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-md);
                        background: var(--bg-code);
                        color: var(--text-primary);
                        resize: vertical;
                    ">${initialCode}</textarea>
                    
                    <div class="editor-actions" style="
                        display: flex;
                        gap: 1rem;
                        margin-top: 1rem;
                        justify-content: flex-end;
                    ">
                        <button class="run-query" style="
                            background: var(--primary-color);
                            color: var(--text-inverse);
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: var(--radius-md);
                            cursor: pointer;
                            font-weight: 500;
                        ">Run Query</button>
                        <button class="reset-query" style="
                            background: var(--bg-tertiary);
                            color: var(--text-secondary);
                            border: 1px solid var(--border-color);
                            padding: 0.75rem 1.5rem;
                            border-radius: var(--radius-md);
                            cursor: pointer;
                            font-weight: 500;
                        ">Reset</button>
                    </div>
                    
                    <div class="query-result" style="
                        margin-top: 1rem;
                        padding: 1rem;
                        background: var(--bg-secondary);
                        border-radius: var(--radius-md);
                        border: 1px solid var(--border-color);
                        display: none;
                    ">
                        <h4 style="margin: 0 0 1rem 0; color: var(--text-primary);">Query Result:</h4>
                        <div class="result-content"></div>
                    </div>
                </div>
            </div>
        `;

        // Setup event listeners
        const closeBtn = modal.querySelector('.close-editor');
        const runBtn = modal.querySelector('.run-query');
        const resetBtn = modal.querySelector('.reset-query');
        const editor = modal.querySelector('.sql-editor');
        const resultContainer = modal.querySelector('.query-result');

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        runBtn.addEventListener('click', () => {
            this.simulateQueryExecution(editor.value, resultContainer);
        });

        resetBtn.addEventListener('click', () => {
            editor.value = initialCode;
            resultContainer.style.display = 'none';
        });

        // Close on Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        return modal;
    }

    simulateQueryExecution(query, resultContainer) {
        // Simulate query execution with sample results
        const resultContent = resultContainer.querySelector('.result-content');
        
        // Show loading state
        resultContent.innerHTML = '<p style="color: var(--text-secondary);"><i class="fas fa-spinner fa-spin"></i> Running query...</p>';
        resultContainer.style.display = 'block';
        
        setTimeout(() => {
            // Simulate different results based on query type
            if (query.toLowerCase().includes('select')) {
                resultContent.innerHTML = `
                    <div class="table-container">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg-tertiary);">
                                    <th style="padding: 0.5rem; border: 1px solid var(--border-color);">first_name</th>
                                    <th style="padding: 0.5rem; border: 1px solid var(--border-color);">last_name</th>
                                    <th style="padding: 0.5rem; border: 1px solid var(--border-color);">email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border-color);">John</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border-color);">Doe</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border-color);">john.doe@email.com</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border-color);">Sarah</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border-color);">Smith</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border-color);">sarah.smith@email.com</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-info-circle"></i> 2 rows returned in 0.001 seconds
                    </p>
                `;
            } else {
                resultContent.innerHTML = `
                    <p style="color: var(--text-secondary);">
                        <i class="fas fa-exclamation-triangle"></i> 
                        This is a demo environment. Try SELECT queries to see sample results!
                    </p>
                `;
            }
            
            this.trackEvent('sql_editor_used', { 
                query: query.substring(0, 100) // Limit for privacy
            });
        }, 1000);
    }

    setupTryItButtons() {
        const tryItButtons = document.querySelectorAll('.try-it-btn');
        
        tryItButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const codeBlock = button.closest('.code-example');
                if (codeBlock) {
                    this.openSQLEditor(codeBlock);
                }
            });
        });
    }

    setupProgressTracking() {
        // Track lesson completion
        this.trackLessonProgress();
        
        // Update progress bar
        this.updateProgressBar();
    }

    trackLessonProgress() {
        const lessonId = this.getCurrentLessonId();
        const completedLessons = this.getCompletedLessons();
        
        // Mark current lesson as started
        if (!completedLessons.includes(lessonId)) {
            this.markLessonStarted(lessonId);
        }
        
        // Track scroll progress
        let maxScroll = 0;
        const trackScroll = () => {
            const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            if (maxScroll > 80 && !completedLessons.includes(lessonId)) {
                this.markLessonCompleted(lessonId);
            }
        };
        
        window.addEventListener('scroll', this.throttle(trackScroll, 1000));
    }

    getCurrentLessonId() {
        // Extract lesson ID from URL or page meta
        const path = window.location.pathname;
        return path.split('/').pop() || 'introduction';
    }

    getCompletedLessons() {
        return JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    }

    markLessonStarted(lessonId) {
        const startedLessons = JSON.parse(localStorage.getItem('started_lessons') || '[]');
        if (!startedLessons.includes(lessonId)) {
            startedLessons.push(lessonId);
            localStorage.setItem('started_lessons', JSON.stringify(startedLessons));
        }
        
        this.trackEvent('lesson_started', { lesson: lessonId });
    }

    markLessonCompleted(lessonId) {
        const completedLessons = this.getCompletedLessons();
        if (!completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
            localStorage.setItem('completed_lessons', JSON.stringify(completedLessons));
            
            // Update sidebar
            this.updateSidebarProgress();
            
            this.trackEvent('lesson_completed', { lesson: lessonId });
        }
    }

    updateSidebarProgress() {
        const completedLessons = this.getCompletedLessons();
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        
        sidebarLinks.forEach((link, index) => {
            const lessonId = link.getAttribute('href')?.replace('/', '') || `lesson-${index}`;
            if (completedLessons.includes(lessonId)) {
                link.classList.add('completed');
            }
        });
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar && progressText) {
            const completedLessons = this.getCompletedLessons();
            const totalLessons = 12; // SQL Basics has 12 lessons
            const progress = (completedLessons.length / totalLessons) * 100;
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${completedLessons.length} of ${totalLessons} lessons completed`;
        }
    }

    trackEvent(eventName, properties = {}) {
        // Placeholder for analytics tracking
        console.log('Track Event:', eventName, properties);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TutorialQuiz();
});

// Export for potential module usage
window.TutorialQuiz = TutorialQuiz;