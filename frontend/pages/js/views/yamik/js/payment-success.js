// Initialize page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get booking details from localStorage
    const bookingDetails = JSON.parse(localStorage.getItem('lastBookingDetails') || '{}');
    
    // If no booking details found, provide default message
    if (!bookingDetails.service) {
        document.getElementById('booking-details').innerHTML = `
            <p>No booking details available. Your payment was still processed successfully.</p>
        `;
    } else {
        // Format date if it exists
        let formattedDate = '';
        if (bookingDetails.date) {
            const bookingDate = new Date(bookingDetails.date);
            formattedDate = bookingDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // Populate booking details
        document.getElementById('booking-details').innerHTML = `
            <div class="detail-item">
                <strong>Service:</strong> ${bookingDetails.service || 'N/A'}
            </div>
            <div class="detail-item">
                <strong>Date:</strong> ${formattedDate || 'N/A'}
            </div>
            <div class="detail-item">
                <strong>Time:</strong> ${bookingDetails.time || 'N/A'}
            </div>
            <div class="detail-item">
                <strong>Amount Paid:</strong> ₹${bookingDetails.price || '0.00'}
            </div>
        `;
    }
    
    // Add to booking history
    updateBookingHistory(bookingDetails);
    
    // Set up return button
    document.getElementById('return-button').addEventListener('click', function() {
        window.location.href = 'notifications.html';
    });
});

// Update booking history in localStorage
function updateBookingHistory(bookingDetails) {
    if (!bookingDetails.service) return; // Don't save empty bookings
    
    // Get existing history or create new array
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    
    // Add payment timestamp to the booking
    bookingDetails.paymentDate = new Date().toISOString();
    bookingDetails.paymentStatus = 'Completed';
    
    // Add to history
    bookingHistory.push(bookingDetails);
    
    // Save back to localStorage
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
} 