// Enhanced JavaScript for the Customer Management System
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  loadCustomers();
  setupEventListeners();
  
  // Check if there are customers to show/hide no customers message
  updateNoCustomersMessage();
});

function setupEventListeners() {
  // Form submission
  document.getElementById('customer-form').addEventListener('submit', handleFormSubmit);
  
  // Reset button
  document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('customer-form').reset();
    document.getElementById('form-error').textContent = '';
  });
  
  // Modal close buttons
  const closeBtn = document.querySelector('.close-btn');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Close button clicked');
      closeModal();
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('edit-modal');
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Edit form submission
  document.getElementById('edit-form').addEventListener('submit', handleEditFormSubmit);
  
  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const errorDiv = document.getElementById('form-error');
  errorDiv.textContent = '';
  
  // Show spinner on submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('/register', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      errorDiv.textContent = errorData.detail || 'Failed to register customer.';
      return;
    }

    form.reset();
    loadCustomers();
    showFlashMessage('Customer added successfully!');
  } catch (error) {
    errorDiv.textContent = 'An unexpected error occurred.';
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
}

async function loadCustomers() {
  const tbody = document.querySelector('#customers-table tbody');
  const errorDiv = document.getElementById('form-error');
  const noCustomersMsg = document.getElementById('no-customers-message');
  
  // Add loading state
  tbody.innerHTML = '<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading customers...</td></tr>';
  errorDiv.textContent = '';
  noCustomersMsg.style.display = 'none'; // Hide message during loading

  try {
    const response = await fetch('/customers');
    if (!response.ok) {
      const errorData = await response.json();
      errorDiv.textContent = errorData.detail || 'Failed to load customers.';
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">Error loading customers</td></tr>';
      return;
    }

    const customers = await response.json();
    
    // Clear the table
    tbody.innerHTML = '';

    if (customers.length === 0) {
      noCustomersMsg.style.display = 'block';
    } else {
      noCustomersMsg.style.display = 'none';
      customers.forEach(cust => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', cust.id);
        tr.innerHTML = `
          <td>${cust.id}</td>
          <td>${sanitize(cust.first_name)} ${sanitize(cust.last_name)}</td>
          <td>${sanitize(cust.email)}</td>
          <td>${sanitize(cust.company)}</td>
          <td>${sanitize(cust.position)}</td>
          <td class="action-buttons">
            <button class="edit-btn" onclick="openEditModal(${cust.id})"><i class="fas fa-edit"></i> Edit</button>
            <button class="delete-btn" onclick="deleteCustomer(${cust.id})"><i class="fas fa-trash"></i> Delete</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    errorDiv.textContent = 'An unexpected error occurred while loading customers.';
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Error loading customers</td></tr>';
    noCustomersMsg.style.display = 'none';
  }
}

// Helper function to sanitize user input for display
function sanitize(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function updateNoCustomersMessage() {
  const tbody = document.querySelector('#customers-table tbody');
  const noCustomersMsg = document.getElementById('no-customers-message');
  
  if (tbody.children.length === 0 || (tbody.children.length === 1 && tbody.children[0].querySelector('td').colSpan)) {
    noCustomersMsg.style.display = 'block';
  } else {
    noCustomersMsg.style.display = 'none';
  }
}

async function deleteCustomer(id) {
  // Use a nicer confirmation dialog (you could replace with a custom modal)
  if (!confirm('Are you sure you want to delete this customer?')) return;

  const errorDiv = document.getElementById('form-error');
  const row = document.querySelector(`tr[data-id="${id}"]`);
  
  // Add deleting visual state
  if (row) {
    row.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    row.style.opacity = '0.7';
  }

  try {
    const response = await fetch(`/customers/${id}`, { method: 'DELETE' });
    if (response.ok) {
      if (row) {
        // Animate row removal
        row.style.transition = 'all 0.3s';
        row.style.height = '0';
        row.style.opacity = '0';
        
        setTimeout(() => {
          loadCustomers();
        }, 300);
      } else {
        loadCustomers();
      }
      
      showFlashMessage('Customer deleted successfully!');
    } else {
      if (row) {
        // Restore row styles if deletion failed
        row.style.backgroundColor = '';
        row.style.opacity = '';
      }
      
      errorDiv.textContent = 'Failed to delete customer';
    }
  } catch {
    errorDiv.textContent = 'Error deleting customer';
    
    if (row) {
      // Restore row styles if deletion failed
      row.style.backgroundColor = '';
      row.style.opacity = '';
    }
  }
}

async function openEditModal(id) {
  const errorDiv = document.getElementById('edit-form-error');
  errorDiv.textContent = '';
  
  // Show loading state in modal
  const modal = document.getElementById('edit-modal');
  const modalBody = modal.querySelector('.modal-body');
  const originalContent = modalBody.innerHTML;
  
  modal.style.display = 'flex';
  modalBody.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top: 1rem;">Loading customer data...</p></div>';
  
  try {
    const response = await fetch(`/customers/${id}`);
    if (!response.ok) {
      modalBody.innerHTML = originalContent;
      errorDiv.textContent = 'Failed to load customer data';
      return;
    }
    
    const customer = await response.json();
    
    // Restore original form and populate fields
    modalBody.innerHTML = originalContent;
    
    // Populate form fields
    document.getElementById('edit-id').value = customer.id;
    document.getElementById('edit-first_name').value = customer.first_name;
    document.getElementById('edit-last_name').value = customer.last_name;
    document.getElementById('edit-email').value = customer.email;
    document.getElementById('edit-phone').value = customer.phone || '';
    document.getElementById('edit-age').value = customer.age || '';
    document.getElementById('edit-company').value = customer.company;
    document.getElementById('edit-position').value = customer.position;
    document.getElementById('edit-salary').value = customer.salary || '';
    document.getElementById('edit-years_employed').value = customer.years_employed || '';
  } catch (error) {
    modalBody.innerHTML = originalContent;
    errorDiv.textContent = 'Error loading customer data';
  }
}

function closeModal() {
  const modal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  
  // Reset form fields
  if (editForm) {
    editForm.reset();
  }
  
  modal.style.display = 'none';
  document.getElementById('edit-form-error').textContent = '';
}

async function handleEditFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const customerId = document.getElementById('edit-id').value;
  const errorDiv = document.getElementById('edit-form-error');
  errorDiv.textContent = '';
  
  // Show loading state
  const saveBtn = form.querySelector('.save-btn');
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  saveBtn.disabled = true;
  
  try {
    const response = await fetch(`/customers/${customerId}`, {
      method: 'PUT',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      errorDiv.textContent = errorData.detail || 'Failed to update customer.';
      return;
    }
    
    closeModal();
    loadCustomers();
    showFlashMessage('Customer updated successfully!');
  } catch (error) {
    errorDiv.textContent = 'An unexpected error occurred.';
  } finally {
    // Restore button state
    saveBtn.innerHTML = originalBtnText;
    saveBtn.disabled = false;
  }
}

function showFlashMessage(message, type = 'success') {
  const flash = document.getElementById('flash-message');
  flash.textContent = message;
  
  // Set appropriate colors
  if (type === 'success') {
    flash.style.backgroundColor = 'var(--success-color)';
  } else if (type === 'error') {
    flash.style.backgroundColor = 'var(--danger-color)';
  }
  
  // Show the message
  flash.classList.add('visible');
  
  // Hide after 3 seconds
  setTimeout(() => {
    flash.classList.remove('visible');
  }, 3000);
}