// Tutorial filtering functionality
class TutorialFilters {
    constructor() {
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupSearch();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const tutorialCards = document.querySelectorAll('.tutorial-card');

        if (!filterButtons.length || !tutorialCards.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterTutorials(filter, filterButtons, tutorialCards);
            });
        });
    }

    filterTutorials(filter, filterButtons, tutorialCards) {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`[data-filter="${filter}"]`);
        if (activeButton) activeButton.classList.add('active');

        // Filter tutorial cards
        tutorialCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || (categories && categories.includes(filter));
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });

        // Update results count
        this.updateResultsCount(filter, tutorialCards);
        
        // Track filter usage
        this.trackEvent('filter_tutorials', { filter });
    }

    updateResultsCount(filter, tutorialCards) {
        const visibleCount = Array.from(tutorialCards).filter(card => 
            card.style.display !== 'none'
        ).length;

        // Create or update results indicator
        let resultsIndicator = document.querySelector('.filter-results');
        if (!resultsIndicator) {
            resultsIndicator = document.createElement('div');
            resultsIndicator.className = 'filter-results';
            resultsIndicator.style.cssText = `
                text-align: center;
                margin: 1rem 0;
                color: var(--text-secondary);
                font-size: 0.875rem;
            `;
            
            const tutorialGrid = document.querySelector('.tutorial-grid');
            if (tutorialGrid) {
                tutorialGrid.parentNode.insertBefore(resultsIndicator, tutorialGrid);
            }
        }

        const filterText = filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1);
        resultsIndicator.textContent = `Showing ${visibleCount} ${filterText} tutorial${visibleCount !== 1 ? 's' : ''}`;
    }

    setupSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            // Debounce search input
            let searchTimeout;
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchTutorials(e.target.value);
                }, 300);
            });
        });
    }

    searchTutorials(query) {
        const tutorialCards = document.querySelectorAll('.tutorial-card');
        const searchQuery = query.toLowerCase().trim();

        if (!searchQuery) {
            // Reset to show all tutorials
            tutorialCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        let visibleCount = 0;
        
        tutorialCards.forEach(card => {
            const title = card.querySelector('.tutorial-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.tutorial-description')?.textContent.toLowerCase() || '';
            const category = card.querySelector('.category')?.textContent.toLowerCase() || '';
            
            const matchesSearch = title.includes(searchQuery) || 
                                description.includes(searchQuery) || 
                                category.includes(searchQuery);
            
            if (matchesSearch) {
                card.style.display = 'block';
                this.highlightSearchTerms(card, searchQuery);
                visibleCount++;
            } else {
                card.style.display = 'none';
                this.removeHighlights(card);
            }
        });

        // Update search results indicator
        this.updateSearchResults(searchQuery, visibleCount);
        
        // Track search
        this.trackEvent('search_tutorials', { query: searchQuery, results: visibleCount });
    }

    highlightSearchTerms(card, query) {
        const title = card.querySelector('.tutorial-title a');
        const description = card.querySelector('.tutorial-description');
        
        if (title) {
            title.innerHTML = this.highlightText(title.textContent, query);
        }
        
        if (description) {
            description.innerHTML = this.highlightText(description.textContent, query);
        }
    }

    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background-color: var(--primary-color); color: var(--text-inverse); padding: 0.125rem 0.25rem; border-radius: 0.25rem;">$1</mark>');
    }

    removeHighlights(card) {
        const highlighted = card.querySelectorAll('mark');
        highlighted.forEach(mark => {
            mark.outerHTML = mark.textContent;
        });
    }

    updateSearchResults(query, count) {
        let searchResults = document.querySelector('.search-results');
        if (!searchResults) {
            searchResults = document.createElement('div');
            searchResults.className = 'search-results';
            searchResults.style.cssText = `
                text-align: center;
                margin: 1rem 0;
                color: var(--text-secondary);
                font-size: 0.875rem;
                padding: 1rem;
                background-color: var(--bg-secondary);
                border-radius: var(--radius-md);
            `;
            
            const tutorialGrid = document.querySelector('.tutorial-grid');
            if (tutorialGrid) {
                tutorialGrid.parentNode.insertBefore(searchResults, tutorialGrid);
            }
        }

        if (query) {
            searchResults.innerHTML = `
                Found <strong>${count}</strong> tutorial${count !== 1 ? 's' : ''} matching "<strong>${query}</strong>"
                ${count === 0 ? '<br><small>Try different keywords or browse all tutorials</small>' : ''}
            `;
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TutorialFilters();
});

// Export for potential module usage
window.TutorialFilters = TutorialFilters;