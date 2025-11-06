 
        let expenses = [];
        let categories = [];
        let expenseIdCounter = 1;
        let categoryIdCounter = 1;
        let deleteCallback = null;
        let currentFilter = 'all';
        const FIXED_INCOME = 100000;

        let monthlyChart = null;
        let weeklyChart = null;
        let categoryChart = null;

        const categoryColors = {
            'Education': '#3498db',
            'Food': '#e74c3c',
            'Travel': '#9b59b6',
            'Entertainment': '#f39c12',
            'Health': '#1abc9c',
            'Shopping': '#e91e63',
            'Utilities': '#34495e',
            'Other': '#95a5a6'
        };

        function init() {
            const today = new Date();
            document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('expenseDate').valueAsDate = today;

            initializeDefaultCategories();
            
            loadSampleExpenses();
            
            updateDashboard();
            updateExpenseTable();
            populateCategoryDropdown();
            renderCategories();
            initializeCharts();
        }

        function initializeDefaultCategories() {
            const defaultCategories = [
                {
                    name: 'Education',
                    subcategories: ['Books', 'Courses', 'Tuition', 'Notes', 'Assignment Materials']
                },
                {
                    name: 'Food',
                    subcategories: ['Groceries', 'Dining Out', 'Coffee/Tea', 'Snacks', 'Meals']
                },
                {
                    name: 'Travel',
                    subcategories: ['Fuel', 'Public Transport', 'Flights', 'Hotel', 'Taxi/Uber']
                },
                {
                    name: 'Entertainment',
                    subcategories: ['Movies', 'Games', 'Music', 'Events', 'Streaming']
                },
                {
                    name: 'Health',
                    subcategories: ['Medical', 'Fitness', 'Pharmacy', 'Wellness', 'Insurance']
                },
                {
                    name: 'Shopping',
                    subcategories: ['Clothing', 'Electronics', 'Groceries', 'Home', 'Beauty']
                },
                {
                    name: 'Utilities',
                    subcategories: ['Electricity', 'Water', 'Internet', 'Phone', 'Gas']
                },
                {
                    name: 'Other',
                    subcategories: ['Miscellaneous', 'Gifts', 'Charity']
                }
            ];

            categories = defaultCategories.map(cat => ({
                id: categoryIdCounter++,
                name: cat.name,
                subcategories: cat.subcategories.map((sub, idx) => ({
                    id: idx + 1,
                    name: sub
                }))
            }));
        }

        function loadSampleExpenses() {
            const sampleExpenses = [
                { date: '2025-01-10', category: 'Food', subcategory: 'Groceries', description: 'Weekly groceries', amount: 4500 },
                { date: '2025-01-09', category: 'Education', subcategory: 'Books', description: 'Programming book', amount: 1200 },
                { date: '2025-01-08', category: 'Travel', subcategory: 'Fuel', description: 'Fuel for car', amount: 2000 },
                { date: '2025-01-07', category: 'Entertainment', subcategory: 'Movies', description: 'Movie tickets', amount: 800 },
                { date: '2025-01-06', category: 'Food', subcategory: 'Dining Out', description: 'Restaurant dinner', amount: 2000 },
                { date: '2025-10-15', category: 'Shopping', subcategory: 'Clothing', description: 'Winter jacket', amount: 3500 },
                { date: '2025-09-20', category: 'Health', subcategory: 'Medical', description: 'Doctor visit', amount: 1500 },
                { date: '2025-08-10', category: 'Utilities', subcategory: 'Electricity', description: 'Monthly bill', amount: 2200 },
                { date: '2025-07-05', category: 'Entertainment', subcategory: 'Streaming', description: 'Netflix subscription', amount: 649 },
                { date: '2025-06-12', category: 'Travel', subcategory: 'Flights', description: 'Trip to Delhi', amount: 8500 }
            ];

            expenses = sampleExpenses.map(exp => ({
                id: expenseIdCounter++,
                ...exp
            }));
        }

        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });

            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            document.getElementById(sectionId).classList.add('active');

            event.target.classList.add('active');

            if (sectionId === 'analytics') {
                updateCharts();
            } else if (sectionId === 'ai-advice') {
                generateAIAdvice();
            }
        }

        function addExpense(event) {
            event.preventDefault();

            const expense = {
                id: expenseIdCounter++,
                date: document.getElementById('expenseDate').value,
                amount: parseInt(document.getElementById('expenseAmount').value),
                category: document.getElementById('expenseCategory').value,
                subcategory: document.getElementById('expenseSubcategory').value,
                description: document.getElementById('expenseDescription').value
            };

            setTimeout(() => {
                expenses.push(expense);
                
                const successMsg = document.getElementById('addSuccessMessage');
                successMsg.classList.add('active');
                setTimeout(() => {
                    successMsg.classList.remove('active');
                }, 3000);
                console.log('added Successfully ')
                document.getElementById('expenseForm').reset();
                document.getElementById('expenseDate').valueAsDate = new Date();

                updateDashboard();
                updateExpenseTable();
                updateCharts();

                console.log('Expense added:', expense);
            }, 300);
        }

        function updateDashboard() {
            const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const netBalance = FIXED_INCOME - totalExpenses;

            animateValue('totalExpenses', 0, totalExpenses, 1000, '₹');
            animateValue('totalIncome', 0, FIXED_INCOME, 1000, '₹');
            animateValue('netBalance', 0, netBalance, 1000, '₹');

            const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
            const recentActivity = document.getElementById('recentActivity');
            
            if (recentExpenses.length === 0) {
                recentActivity.innerHTML = '<p>No expenses yet. Add your first expense!</p>';
            } else {
                recentActivity.innerHTML = recentExpenses.map(exp => `
                    <div class="subcategory-item">
                        <div>
                            <strong>${exp.category} - ${exp.subcategory}</strong><br>
                            <small>${exp.description}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong>₹${exp.amount.toLocaleString()}</strong><br>
                            <small>${new Date(exp.date).toLocaleDateString()}</small>
                        </div>
                    </div>
                `).join('');
            }
        }

        function animateValue(id, start, end, duration, prefix = '') {
            const element = document.getElementById(id);
            const range = end - start;
            const increment = range / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    current = end;
                    clearInterval(timer);
                }
                element.textContent = prefix + Math.round(current).toLocaleString();
                element.classList.add('counting');
            }, 16);
        }

        function updateSubcategories() {
            const categorySelect = document.getElementById('expenseCategory');
            const subcategorySelect = document.getElementById('expenseSubcategory');
            const selectedCategory = categories.find(cat => cat.name === categorySelect.value);

            subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';

            if (selectedCategory) {
                selectedCategory.subcategories.forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub.name;
                    option.textContent = sub.name;
                    subcategorySelect.appendChild(option);
                });
            }
        }

        function populateCategoryDropdown() {
            const categorySelect = document.getElementById('expenseCategory');
            categorySelect.innerHTML = '<option value="">Select Category</option>';

            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.name;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        }

        function updateExpenseTable() {
            const tbody = document.getElementById('expensesTableBody');
            const filteredExpenses = getFilteredExpenses();

            if (filteredExpenses.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No expenses found</td></tr>';
                document.getElementById('filteredTotal').textContent = '₹0';
                return;
            }

            filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

            tbody.innerHTML = filteredExpenses.map(exp => `
                <tr>
                    <td>${new Date(exp.date).toLocaleDateString()}</td>
                    <td><span style="color: ${categoryColors[exp.category] || '#95a5a6'};">${exp.category}</span></td>
                    <td>${exp.subcategory}</td>
                    <td>${exp.description}</td>
                    <td><strong>₹${exp.amount.toLocaleString()}</strong></td>
                    <td>
                        <button class="btn btn-danger btn-small" onclick="deleteExpense(${exp.id})">🗑️ Delete</button>
                    </td>
                </tr>
            `).join('');

            const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            document.getElementById('filteredTotal').textContent = '₹' + total.toLocaleString();
        }

        function filterExpenses(filter) {
            currentFilter = filter;
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            updateExpenseTable();
        }

        function getFilteredExpenses() {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            switch (currentFilter) {
                case 'today':
                    return expenses.filter(exp => {
                        const expDate = new Date(exp.date);
                        expDate.setHours(0, 0, 0, 0);
                        return expDate.getTime() === now.getTime();
                    });
                case 'week':
                    const weekAgo = new Date(now);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return expenses.filter(exp => new Date(exp.date) >= weekAgo);
                case 'month':
                    return expenses.filter(exp => {
                        const expDate = new Date(exp.date);
                        return expDate.getMonth() === now.getMonth() && 
                               expDate.getFullYear() === now.getFullYear();
                    });
                case 'year':
                    return expenses.filter(exp => {
                        const expDate = new Date(exp.date);
                        return expDate.getFullYear() === now.getFullYear();
                    });
                default:
                    return expenses;
            }
        }

        function deleteExpense(id) {
            deleteCallback = () => {
                expenses = expenses.filter(exp => exp.id !== id);
                updateDashboard();
                updateExpenseTable();
                updateCharts();
                closeModal('deleteModal');
                console.log('Expense deleted:', id);
            };
            document.getElementById('deleteModal').classList.add('active');
        }

        function confirmDelete() {
            if (deleteCallback) {
                deleteCallback();
                deleteCallback = null;
            }
        }

        function initializeCharts() {
            const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
            monthlyChart = new Chart(monthlyCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Monthly Expenses',
                        data: [],
                        backgroundColor: 'rgba(30, 60, 114, 0.8)',
                        borderColor: 'rgba(30, 60, 114, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => '₹' + context.parsed.y.toLocaleString()
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => '₹' + value.toLocaleString()
                            }
                        }
                    }
                }
            });

            const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
            weeklyChart = new Chart(weeklyCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Weekly Expenses',
                        data: [],
                        backgroundColor: 'rgba(0, 212, 255, 0.2)',
                        borderColor: 'rgba(0, 212, 255, 1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => '₹' + context.parsed.y.toLocaleString()
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => '₹' + value.toLocaleString()
                            }
                        }
                    }
                }
            });

            const categoryCtx = document.getElementById('categoryChart').getContext('2d');
            categoryChart = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: { size: 12 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.label || '';
                                    const value = '₹' + context.parsed.toLocaleString();
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });

            updateCharts();
        }

        function updateCharts() {
            const monthlyData = {};
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            expenses.forEach(exp => {
                const date = new Date(exp.date);
                const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
                monthlyData[monthYear] = (monthlyData[monthYear] || 0) + exp.amount;
            });

            const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
                const [monthA, yearA] = a.split(' ');
                const [monthB, yearB] = b.split(' ');
                const dateA = new Date(`${monthA} 1, ${yearA}`);
                const dateB = new Date(`${monthB} 1, ${yearB}`);
                return dateA - dateB;
            });

            monthlyChart.data.labels = sortedMonths;
            monthlyChart.data.datasets[0].data = sortedMonths.map(month => monthlyData[month]);
            monthlyChart.update();

            const weeklyData = {};
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dayLabel = `${daysOfWeek[date.getDay()]} ${date.getDate()}`;
                weeklyData[dayLabel] = 0;
            }

            expenses.forEach(exp => {
                const expDate = new Date(exp.date);
                const daysDiff = Math.floor((today - expDate) / (1000 * 60 * 60 * 24));
                if (daysDiff >= 0 && daysDiff < 7) {
                    const dayLabel = `${daysOfWeek[expDate.getDay()]} ${expDate.getDate()}`;
                    if (weeklyData.hasOwnProperty(dayLabel)) {
                        weeklyData[dayLabel] += exp.amount;
                    }
                }
            });

            weeklyChart.data.labels = Object.keys(weeklyData);
            weeklyChart.data.datasets[0].data = Object.values(weeklyData);
            weeklyChart.update();

            const categoryData = {};
            expenses.forEach(exp => {
                categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
            });

            const categoryLabels = Object.keys(categoryData);
            const categoryValues = Object.values(categoryData);
            const colors = categoryLabels.map(cat => categoryColors[cat] || '#95a5a6');

            categoryChart.data.labels = categoryLabels;
            categoryChart.data.datasets[0].data = categoryValues;
            categoryChart.data.datasets[0].backgroundColor = colors;
            categoryChart.update();
        }

        function generateAIAdvice() {
            const spinner = document.getElementById('aiSpinner');
            const container = document.getElementById('adviceContainer');
            
            spinner.classList.add('active');
            container.innerHTML = '';

            setTimeout(() => {
                spinner.classList.remove('active');
                
                const advice = analyzeExpenses();
                container.innerHTML = advice.map((item, idx) => `
                    <div class="advice-card" style="animation-delay: ${idx * 0.1}s;">
                        <div class="advice-icon">${item.icon}</div>
                        <div class="advice-title">${item.title}</div>
                        <div class="advice-text">${item.text}</div>
                    </div>
                `).join('');
            }, 1000);
        }

        function analyzeExpenses() {
            const advice = [];
            const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            
            if (totalExpenses === 0) {
                return [{
                    icon: '📊',
                    title: 'No Data Yet',
                    text: 'Start adding expenses to receive personalized financial advice and insights.'
                }];
            }

            const categoryTotals = {};
            const subcategoryTotals = {};
            
            expenses.forEach(exp => {
                categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
                const key = `${exp.category}-${exp.subcategory}`;
                subcategoryTotals[key] = (subcategoryTotals[key] || 0) + exp.amount;
            });

            const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
            const highestCategory = sortedCategories[0];
            const highestPercentage = ((highestCategory[1] / totalExpenses) * 100).toFixed(1);

            advice.push({
                icon: '🎯',
                title: 'Highest Spending Category',
                text: `You spent ${highestPercentage}% (₹${highestCategory[1].toLocaleString()}) on ${highestCategory[0]}. ${highestPercentage > 30 ? 'Consider reducing expenses in this category.' : 'This seems reasonable.'}`
            });

            const monthlyAverage = totalExpenses / Math.max(1, new Set(expenses.map(e => new Date(e.date).getMonth())).size);
            advice.push({
                icon: '📅',
                title: 'Monthly Average',
                text: `Your average monthly spending is ₹${Math.round(monthlyAverage).toLocaleString()}. ${monthlyAverage > FIXED_INCOME * 0.7 ? 'Try to keep it below 70% of your income.' : 'Great job staying within budget!'}`
            });

            const savingsRate = ((FIXED_INCOME - totalExpenses) / FIXED_INCOME * 100).toFixed(1);
            advice.push({
                icon: '💰',
                title: 'Savings Potential',
                text: `With current spending, you're ${savingsRate > 0 ? 'saving' : 'overspending by'} ${Math.abs(savingsRate)}% of your income. ${savingsRate > 20 ? 'Excellent savings rate!' : 'Aim for at least 20% savings.'}`
            });

            if (sortedCategories.length > 1) {
                const secondCategory = sortedCategories[1];
                advice.push({
                    icon: '💡',
                    title: 'Smart Tip',
                    text: `Your ${secondCategory[0]} expenses (₹${secondCategory[1].toLocaleString()}) could be optimized. Look for deals or alternatives to save more.`
                });
            }

            const sortedSubcategories = Object.entries(subcategoryTotals).sort((a, b) => b[1] - a[1]);
            if (sortedSubcategories.length > 0) {
                const topSubcategory = sortedSubcategories[0];
                const [category, subcategory] = topSubcategory[0].split('-');
                advice.push({
                    icon: '🔍',
                    title: 'Detailed Insight',
                    text: `Within ${category}, you spend most on ${subcategory} (₹${topSubcategory[1].toLocaleString()}). Consider if this aligns with your priorities.`
                });
            }

            return advice;
        }

        function renderCategories() {
            const grid = document.getElementById('categoryGrid');
            grid.innerHTML = categories.map(cat => `
                <div class="category-card" style="border-top-color: ${categoryColors[cat.name] || '#95a5a6'};">
                    <div class="category-header">
                        <div class="category-name">${cat.name}</div>
                        <button class="btn btn-danger btn-small" onclick="deleteCategory(${cat.id})">🗑️</button>
                    </div>
                    <div class="subcategory-list">
                        ${cat.subcategories.map(sub => `
                            <div class="subcategory-item">
                                <span>${sub.name}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary btn-small" onclick="openSubcategoryModal(${cat.id})" style="width: 100%; margin-top: 0.5rem;">⚙️ Manage Subcategories</button>
                </div>
            `).join('');
        }

        function openAddCategoryModal() {
            document.getElementById('addCategoryModal').classList.add('active');
        }

        function addCategory(event) {
            event.preventDefault();
            const name = document.getElementById('newCategoryName').value.trim();
            
            if (name) {
                const newCategory = {
                    id: categoryIdCounter++,
                    name: name,
                    subcategories: [{ id: 1, name: 'General' }]
                };
                
                categories.push(newCategory);
                categoryColors[name] = '#' + Math.floor(Math.random()*16777215).toString(16);
                
                populateCategoryDropdown();
                renderCategories();
                closeModal('addCategoryModal');
                document.getElementById('newCategoryName').value = '';
                
                console.log('Category added:', newCategory);
            }
        }

        function deleteCategory(id) {
            deleteCallback = () => {
                const category = categories.find(cat => cat.id === id);
                if (category) {
                    expenses = expenses.filter(exp => exp.category !== category.name);
                    categories = categories.filter(cat => cat.id !== id);
                    
                    populateCategoryDropdown();
                    renderCategories();
                    updateDashboard();
                    updateExpenseTable();
                    updateCharts();
                    closeModal('deleteModal');
                    
                    console.log('Category deleted:', id);
                }
            };
            document.getElementById('deleteModal').classList.add('active');
        }

        function openSubcategoryModal(categoryId) {
            const category = categories.find(cat => cat.id === categoryId);
            if (!category) return;

            const content = document.getElementById('subcategoryModalContent');
            content.innerHTML = `
                <h3 style="margin-bottom: 1rem;">${category.name} Subcategories</h3>
                <form onsubmit="addSubcategory(event, ${categoryId})" style="margin-bottom: 1.5rem;">
                    <div class="form-group">
                        <label class="form-label">New Subcategory</label>
                        <input type="text" id="newSubcategoryName" class="form-input" placeholder="Enter subcategory name" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Add Subcategory</button>
                </form>
                <div class="subcategory-list">
                    ${category.subcategories.map(sub => `
                        <div class="subcategory-item">
                            <span>${sub.name}</span>
                            <button class="btn btn-danger btn-small" onclick="deleteSubcategory(${categoryId}, ${sub.id})">🗑️</button>
                        </div>
                    `).join('')}
                </div>
            `;

            document.getElementById('addSubcategoryModal').classList.add('active');
        }

        function addSubcategory(event, categoryId) {
            event.preventDefault();
            const name = document.getElementById('newSubcategoryName').value.trim();
            const category = categories.find(cat => cat.id === categoryId);
            
            if (name && category) {
                const maxId = Math.max(0, ...category.subcategories.map(s => s.id));
                category.subcategories.push({
                    id: maxId + 1,
                    name: name
                });
                
                openSubcategoryModal(categoryId);
                renderCategories();
                
                console.log('Subcategory added:', name, 'to', category.name);
            }
        }

        function deleteSubcategory(categoryId, subcategoryId) {
            const category = categories.find(cat => cat.id === categoryId);
            if (category && category.subcategories.length > 1) {
                const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
                if (subcategory) {
                    expenses = expenses.filter(exp => !(exp.category === category.name && exp.subcategory === subcategory.name));
                    category.subcategories = category.subcategories.filter(sub => sub.id !== subcategoryId);
                    
                    openSubcategoryModal(categoryId);
                    renderCategories();
                    updateDashboard();
                    updateExpenseTable();
                    updateCharts();
                    
                    console.log('Subcategory deleted:', subcategoryId);
                }
            } else {
                alert('Cannot delete the last subcategory. Each category must have at least one subcategory.');
            }
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('active');
            }
        }

        window.onload = init;