/**
 * Quiz Module
 * Handles personality quiz for product recommendations
 */

class Quiz {
  constructor() {
    this.currentQuestion = 0;
    this.answers = {};
    this.questions = this.getQuestions();
    this.container = null;
    this.initialized = false;
  }

  init() {
    console.log('🎯 Initializing Quiz module');
    this.bindEvents();
    this.initialized = true;
  }

  bindEvents() {
    // Listen for quiz start events
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="start-quiz"]') || 
                e.target.closest('[data-action="start-quiz"]')) {
        e.preventDefault();
        this.startQuiz();
      }
    });

    // Global event listeners for quiz navigation
    document.addEventListener('quiz:next', () => this.nextQuestion());
    document.addEventListener('quiz:previous', () => this.previousQuestion());
    document.addEventListener('quiz:restart', () => this.restartQuiz());
  }

  getQuestions() {
    return [
      {
        id: 1,
        question: "What's your primary wellness goal?",
        options: [
          {
            icon: 'fas fa-heart',
            title: 'Enhanced Intimacy',
            description: 'Looking to improve connection and intimacy with your partner',
            value: 'intimacy'
          },
          {
            icon: 'fas fa-user',
            title: 'Personal Exploration',
            description: 'Want to discover what brings you personal pleasure and satisfaction',
            value: 'personal'
          },
          {
            icon: 'fas fa-dumbbell',
            title: 'Pelvic Health',
            description: 'Focus on strengthening pelvic floor muscles and overall health',
            value: 'health'
          },
          {
            icon: 'fas fa-spa',
            title: 'Stress Relief',
            description: 'Seeking ways to relax and relieve tension through wellness',
            value: 'relaxation'
          }
        ]
      },
      {
        id: 2,
        question: "What's your experience level?",
        options: [
          {
            icon: 'fas fa-seedling',
            title: 'Beginner',
            description: 'New to adult wellness products and want to start gentle',
            value: 'beginner'
          },
          {
            icon: 'fas fa-leaf',
            title: 'Some Experience',
            description: 'Have tried a few things and looking to expand your collection',
            value: 'intermediate'
          },
          {
            icon: 'fas fa-tree',
            title: 'Experienced',
            description: 'Well-versed in adult wellness and seeking premium options',
            value: 'advanced'
          }
        ]
      },
      {
        id: 3,
        question: 'What type of stimulation interests you most?',
        options: [
          {
            icon: 'fas fa-circle',
            title: 'External',
            description: 'Focused on external stimulation and surface-level pleasure',
            value: 'external'
          },
          {
            icon: 'fas fa-dot-circle',
            title: 'Internal',
            description: 'Interested in internal stimulation and deeper sensations',
            value: 'internal'
          },
          {
            icon: 'fas fa-adjust',
            title: 'Both',
            description: 'Want versatile options that offer multiple types of stimulation',
            value: 'both'
          }
        ]
      },
      {
        id: 4,
        question: 'How important is discretion to you?',
        options: [
          {
            icon: 'fas fa-eye-slash',
            title: 'Very Important',
            description: "Need completely discreet products that don't look obvious",
            value: 'high'
          },
          {
            icon: 'fas fa-low-vision',
            title: 'Somewhat Important',
            description: 'Prefer subtle designs but okay with some recognizable features',
            value: 'medium'
          },
          {
            icon: 'fas fa-eye',
            title: 'Not a Concern',
            description: 'Comfortable with any design, aesthetics matter more than discretion',
            value: 'low'
          }
        ]
      },
      {
        id: 5,
        question: "What's your budget range?",
        options: [
          {
            icon: 'fas fa-seedling',
            title: 'Budget Friendly',
            description: '₦15,000 - ₦30,000 - Great quality at accessible prices',
            value: 'budget'
          },
          {
            icon: 'fas fa-star',
            title: 'Premium',
            description: '₦30,000 - ₦60,000 - High-quality materials and features',
            value: 'premium'
          },
          {
            icon: 'fas fa-crown',
            title: 'Luxury',
            description: '₦60,000+ - Top-tier products with premium materials',
            value: 'luxury'
          }
        ]
      }
    ];
  }

  startQuiz() {
    // Create modal or navigate to quiz page
    this.showQuizModal();
    this.showQuestion(0);
  }

  showQuizModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('quizModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create quiz modal
    const modal = document.createElement('div');
    modal.id = 'quizModal';
    modal.className = 'quiz-modal';
    modal.innerHTML = `
            <div class="quiz-modal-content">
                <button class="quiz-close" data-action="close-quiz">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="quiz-header">
                    <h2>Wellness Discovery Quiz</h2>
                    <p>Find products perfect for your journey</p>
                </div>
                
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="quizProgressFill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text" id="quizProgressText">Question 1 of ${this.questions.length}</div>
                </div>
                
                <div id="quizContent" class="quiz-content">
                    <!-- Question content will be inserted here -->
                </div>
                
                <div class="quiz-navigation">
                    <button class="btn btn-secondary" id="quizPrevBtn" style="display: none;">
                        <i class="fas fa-arrow-left"></i>
                        Previous
                    </button>
                    <button class="btn btn-primary" id="quizNextBtn" disabled>
                        Next Question
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                
                <div id="quizResults" class="quiz-results" style="display: none;">
                    <!-- Results will be inserted here -->
                </div>
            </div>
        `;

    document.body.appendChild(modal);
    this.container = modal;

    // Add event listeners
    this.attachModalEvents();

    // Show modal with animation
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
  }

  attachModalEvents() {
    const modal = this.container;
        
    // Close button
    modal.querySelector('[data-action="close-quiz"]').addEventListener('click', () => {
      this.closeQuiz();
    });

    // Navigation buttons
    modal.querySelector('#quizPrevBtn').addEventListener('click', () => {
      this.previousQuestion();
    });

    modal.querySelector('#quizNextBtn').addEventListener('click', () => {
      this.nextQuestion();
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeQuiz();
      }
    });
  }

  showQuestion(index) {
    const question = this.questions[index];
    const content = document.getElementById('quizContent');
        
    content.innerHTML = `
            <div class="quiz-question animate-fadeIn">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, i) => `
                        <div class="quiz-option" data-value="${option.value}" data-index="${i}">
                            <div class="option-icon">
                                <i class="${option.icon}"></i>
                            </div>
                            <div class="option-content">
                                <h4>${option.title}</h4>
                                <p>${option.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

    // Update progress
    const progress = ((index + 1) / this.questions.length) * 100;
    document.getElementById('quizProgressFill').style.width = `${progress}%`;
    document.getElementById('quizProgressText').textContent = 
            `Question ${index + 1} of ${this.questions.length}`;

    // Update navigation
    document.getElementById('quizPrevBtn').style.display = index > 0 ? 'block' : 'none';
    document.getElementById('quizNextBtn').disabled = !this.answers[index];

    // Add click handlers to options
    content.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', () => this.selectOption(option));
    });

    // Pre-select if answer exists
    if (this.answers[index]) {
      const selected = content.querySelector(`[data-value="${this.answers[index]}"]`);
      if (selected) {selected.classList.add('selected');}
    }
  }

  selectOption(element) {
    // Remove previous selection
    element.parentNode.querySelectorAll('.quiz-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    // Add selection
    element.classList.add('selected');
    this.answers[this.currentQuestion] = element.dataset.value;

    // Enable next button
    document.getElementById('quizNextBtn').disabled = false;

    // Add animation
    element.classList.add('animate-pulse');
    setTimeout(() => element.classList.remove('animate-pulse'), 300);
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.showQuestion(this.currentQuestion);
    } else {
      this.showResults();
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.showQuestion(this.currentQuestion);
    }
  }

  showResults() {
    const recommendations = this.generateRecommendations();
        
    // Hide quiz content and navigation
    document.getElementById('quizContent').style.display = 'none';
    document.querySelector('.quiz-navigation').style.display = 'none';
    document.querySelector('.quiz-progress').style.display = 'none';
        
    // Show results
    const resultsContainer = document.getElementById('quizResults');
    resultsContainer.style.display = 'block';
        
    resultsContainer.innerHTML = `
            <div class="results-content animate-fadeIn">
                <div class="results-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h2>Your Personalized Recommendations</h2>
                <p>Based on your responses, we've found the perfect products for you!</p>
                
                <div class="recommended-products">
                    ${recommendations.map(product => `
                        <div class="product-recommendation">
                            <div class="product-match">${product.match}% Match</div>
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <div class="product-price">${product.price}</div>
                            <button class="btn btn-primary" data-action="add-to-cart" data-product-id="${product.id}">
                                <i class="fas fa-cart-plus"></i>
                                Add to Cart
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-secondary" data-action="restart-quiz">
                        <i class="fas fa-redo"></i>
                        Take Quiz Again
                    </button>
                    <button class="btn btn-primary" data-action="view-all-products">
                        <i class="fas fa-shopping-bag"></i>
                        View All Products
                    </button>
                </div>
            </div>
        `;

    // Add event listeners
    resultsContainer.querySelector('[data-action="restart-quiz"]').addEventListener('click', () => {
      this.restartQuiz();
    });

    resultsContainer.querySelector('[data-action="view-all-products"]').addEventListener('click', () => {
      this.closeQuiz();
      window.location.href = '#shop';
    });
  }

  generateRecommendations() {
    const recommendations = [];
    const { 0: goal, 1: experience, 2: stimulation, 3: discretion, 4: budget } = this.answers;

    // Logic for recommendations based on answers
    if (goal === 'personal' && experience === 'beginner') {
      recommendations.push({
        id: 'rose-luxe-vibrator',
        name: 'Rose Luxe Vibrator',
        description: 'Perfect for beginners with gentle vibration modes',
        price: '₦45,800',
        match: 95
      });
    }

    if (goal === 'intimacy' || stimulation === 'both') {
      recommendations.push({
        id: 'couples-ring-set',
        name: 'Couples Ring Set',
        description: 'Enhance intimacy with app-controlled features',
        price: '₦49,500',
        match: 92
      });
    }

    if (goal === 'health') {
      recommendations.push({
        id: 'kegel-trainer',
        name: 'Smart Kegel Trainer',
        description: 'Strengthen pelvic floor with biofeedback technology',
        price: '₦38,250',
        match: 88
      });
    }

    // Default recommendation if needed
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'wellness-starter',
        name: 'Wellness Starter Kit',
        description: 'Everything you need to begin your wellness journey',
        price: '₦29,900',
        match: 85
      });
    }

    return recommendations.slice(0, 3); // Return top 3
  }

  restartQuiz() {
    this.currentQuestion = 0;
    this.answers = {};
        
    // Reset UI
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizContent').style.display = 'block';
    document.querySelector('.quiz-navigation').style.display = 'flex';
    document.querySelector('.quiz-progress').style.display = 'block';
        
    this.showQuestion(0);
  }

  closeQuiz() {
    if (this.container) {
      this.container.classList.remove('active');
      setTimeout(() => {
        this.container.remove();
        this.container = null;
      }, 300);
    }
  }
}

// Create singleton instance
const quiz = new Quiz();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quiz;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => quiz.init());
} else {
  quiz.init();
}
