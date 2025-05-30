document.addEventListener('DOMContentLoaded', function() {
    const ageForm = document.getElementById('ageForm');
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const ageResult = document.getElementById('ageResult');
    
    ageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);
        
        // Simple validation
        if (!day || !month || !year) {
            ageResult.textContent = "Please fill in all fields";
            return;
        }
        
        // Calculate age
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        // Display result
        ageResult.textContent = `You are ${age} years old`;
    });
});