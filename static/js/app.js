const displayContainerEl = document.getElementById("displayContainer")

function saveEmployeeData() {
  localStorage.setItem('employeeData', JSON.stringify(employeeData));
}

let employeeData = [];

function loadEmployeeData() {
  const data = localStorage.getItem('employeeData');
  if (data) {
    employeeData = JSON.parse(data);
    return true;
  }
  return false;
}

if (!loadEmployeeData()) {
  generateEmployeeList()
  saveEmployeeData();
} 

function generateEmployeeList(){
  const firstNames = [
    "Mark", "Sophia", "James", "Olivia", "Liam", "Ava", "Noah", "Emily", "Ethan", "Isabella",
    "Lucas", "Mia", "Mason", "Amelia", "Logan", "Harper", "Elijah", "Evelyn", "Oliver", "Abigail"
  ];
  
  const lastNames = [
    "Evans", "Johnson", "Brown", "Garcia", "Martinez", "Davis", "Miller", "Wilson", "Anderson", "Thomas",
    "Taylor", "Hernandez", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Clark"
  ];
  
  const departments = ["HR", "Engineering", "Marketing", "Sales", "Finance"];
  const roles = ["Manager", "Frontend Developer", "Backend Developer", "Recruiter", "Analyst"];
  
  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName[0].toUpperCase()+firstName.slice(1,firstName.length)} ${lastName[0].toUpperCase()+lastName.slice(1,lastName.length)}`;
    const mail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;
  
    const department = departments[i % departments.length];
    const role = roles[i % roles.length];
  
    employeeData.push({
      id: i,
      name,
      mail,
      department,
      role
    });
  }
}


function renderEmployeeList(data = employeeData) {
  displayContainerEl.innerHTML = ""; // Clear previous list


  if (data.length === 0) {
    // Show "no results" message
    const msgEl = document.createElement("div");
    msgEl.className = "col-12 text-center p-5";
    msgEl.innerHTML = `
      <h3>No Employees Found!!</h3>
      <p>Try adjusting your search criteria</p>
    `;
    displayContainerEl.appendChild(msgEl);
    return;
  }


  data.forEach(emp => {
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-4 col-xl-3 p-3";

    card.innerHTML = `
      <div class="card-wrapper">
        <h2 class="pt-2 pb-2">${emp.name}</h2>
        <p><strong>Email:</strong> ${emp.mail}</p>
        <p><strong>Department:</strong> ${emp.department}</p>
        <p><strong>Role:</strong> ${emp.role}</p>
        <div class="btn-container">
          <button class="btn btn-warning edit-btn" data-id="${emp.id}">Edit</button>
          <button class="btn btn-danger delete-btn" data-id="${emp.id}">Delete</button>
        </div>
      </div>
    `;

    displayContainerEl.appendChild(card);
  });
}

renderEmployeeList()


// Filter functionality
let currentFilters = {
  firstname: '',
  department: '',
  role: ''
};

// Get filter elements
const filterFirstname = document.getElementById('filterFirstname');
const filterDepartment = document.getElementById('filterDepartment');
const filterRole = document.getElementById('filterRole');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const resetFilterBtn = document.getElementById('resetFilterBtn');


// Apply filter function
function applyFilters() {
  const firstnameFilter = filterFirstname.value.toLowerCase().trim();
  const departmentFilter = filterDepartment.value.toLowerCase().trim();
  const roleFilter = filterRole.value.toLowerCase().trim();

  // Update current filters
  currentFilters = {
    firstname: firstnameFilter,
    department: departmentFilter,
    role: roleFilter
  };

}


// Reset filter function
function resetFilters() {
  // Clear filter inputs
  filterFirstname.value = '';
  filterDepartment.value = '';
  filterRole.value = '';

  // Reset current filters
  currentFilters = {
    firstname: '',
    department: '',
    role: ''
  };

}

// Add event listeners
applyFilterBtn.addEventListener('click', function() {
  applyFilters();
  
  // Apply sorting after filtering
  applySorting();

  // Close the filter sidebar
  const filterOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasRight'));
  if (filterOffcanvas) {
    filterOffcanvas.hide();
  }
});

resetFilterBtn.addEventListener('click', function() {
  resetFilters();

  // Apply sorting after resetting filters
  applySorting();
});


// Sorting functionality
let currentSort = {
  field: '',
  direction: 'asc' // 'asc' or 'desc'
};

// Get sort elements
const sortSelect = document.getElementById('sort');

// Sort function
function sortEmployees(data) {
  if (!currentSort.field) {
    return data; // No sorting applied
  }

  return [...data].sort((a, b) => {
    let aValue, bValue;

    if (currentSort.field === 'firstname') {
      aValue = a.name.split(' ')[0].toLowerCase();
      bValue = b.name.split(' ')[0].toLowerCase();
    } else if (currentSort.field === 'department') {
      aValue = a.department.toLowerCase();
      bValue = b.department.toLowerCase();
    } else {
      return 0;
    }

    // Compare values
    if (aValue < bValue) {
      return currentSort.direction === 'asc' ? -1 : 1;
    } else if (aValue > bValue) {
      return currentSort.direction === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  });
}

// Apply sorting
function applySorting() {
  let dataToSort = employeeData;

  // Apply filters first if any
  if (currentFilters.firstname || currentFilters.department || currentFilters.role) {
    dataToSort = dataToSort.filter(emp => {
      const firstName = emp.name.split(' ')[0].toLowerCase();
      const department = emp.department.toLowerCase();
      const role = emp.role.toLowerCase();

      const matchesFirstname = !currentFilters.firstname || firstName.includes(currentFilters.firstname);
      const matchesDepartment = !currentFilters.department || department === currentFilters.department;
      const matchesRole = !currentFilters.role || role === currentFilters.role;

      return matchesFirstname && matchesDepartment && matchesRole;
    });
  }

  // Apply search if any
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm) {
    dataToSort = dataToSort.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.mail.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  const sortedData = sortEmployees(dataToSort);
  
  // Render the final result
  renderEmployeeList(sortedData);
}

// Add sort event listener
sortSelect.addEventListener('change', function() {
  const selectedValue = this.value;
  
  if (selectedValue === 'select') {
    // No sorting
    currentSort.field = '';
    currentSort.direction = 'asc';
  } else if (selectedValue === 'firstname') {
    // Toggle direction for firstname
    if (currentSort.field === 'firstname') {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.field = 'firstname';
      currentSort.direction = 'asc';
    }
  } else if (selectedValue === 'department') {
    // Toggle direction for department
    if (currentSort.field === 'department') {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.field = 'department';
      currentSort.direction = 'asc';
    }
  }

  // Update dropdown text
  updateSortDropdownText();
  
  // Apply sorting
  applySorting();
});

// Add this function to update sort dropdown text
function updateSortDropdownText() {
  const options = sortSelect.options;
  
  if (currentSort.field === 'firstname') {
    options[1].text = currentSort.direction === 'asc' ? 'First Name (A-Z)' : 'First Name (Z-A)';
    options[2].text = 'Department (A-Z)';
  } else if (currentSort.field === 'department') {
    options[1].text = 'First Name (A-Z)';
    options[2].text = currentSort.direction === 'asc' ? 'Department (A-Z)' : 'Department (Z-A)';
  } else {
    options[1].text = 'First Name (A-Z)';
    options[2].text = 'Department (A-Z)';
  }
}

// Get the search input element
const searchInput = document.querySelector('.input-container input');

// Add search functionality
searchInput.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    // If search is empty, apply current filters and sorting
    if (currentFilters.firstname || currentFilters.department || currentFilters.role || currentSort.field) {
      applySorting();
    } else {
      renderEmployeeList();
    }
  } else {
    // Combine search with current filters and sorting
    let filteredEmployees = employeeData.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.mail.toLowerCase().includes(searchTerm)
    );

    // Apply additional filters if any
    if (currentFilters.firstname || currentFilters.department || currentFilters.role) {
      filteredEmployees = filteredEmployees.filter(emp => {
        const firstName = emp.name.split(' ')[0].toLowerCase();
        const department = emp.department.toLowerCase();
        const role = emp.role.toLowerCase();

        const matchesFirstname = !currentFilters.firstname || firstName.includes(currentFilters.firstname);
        const matchesDepartment = !currentFilters.department || department === currentFilters.department;
        const matchesRole = !currentFilters.role || role === currentFilters.role;

        return matchesFirstname && matchesDepartment && matchesRole;
      });
    }

    // Apply sorting
    const sortedEmployees = sortEmployees(filteredEmployees);
    renderEmployeeList(sortedEmployees);
  }
});


// create modal instances
const employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));
const addEmployeeModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));


displayContainerEl.addEventListener("click", function (event) {
  const editBtn = event.target.closest(".edit-btn");
  const deleteBtn = event.target.closest(".delete-btn");

  if (editBtn) {
    const id = Number(editBtn.getAttribute("data-id"));
    const emp = employeeData.find((e) => e.id === id);
    if (emp) {
      document.getElementById("employeeId").value = emp.id;
      document.getElementById("firstName").value = emp.name.split(" ")[0];
      document.getElementById("lastName").value = emp.name.split(" ")[1];
      document.getElementById("email").value = emp.mail;
      document.getElementById("department").value = emp.department;
      document.getElementById("role").value = emp.role;

      // Show the modal
      employeeModal.show();
    }
  }

  // delete functionality
  if (deleteBtn) {
    const id = Number(deleteBtn.getAttribute("data-id"));
    
    // Show confirmation dialog
    if (confirm("Are you sure you want to delete this employee?")) {
      // Find and remove the employee
      const index = employeeData.findIndex(emp => emp.id === id);
      if (index !== -1) {
        employeeData.splice(index, 1);
        
        // Save to localStorage
        if (typeof saveEmployeeData === 'function') {
          saveEmployeeData();
        }
        // Re-render the list
        renderEmployeeList();
      }
    }
  }
});


const addEmployeeBtn = document.getElementById('addEmployeeBtn');

addEmployeeBtn.addEventListener('click', function() {
  // Get form values
  const firstName = document.getElementById('addFirstName').value.trim();
  const lastName = document.getElementById('addLastName').value.trim();
  const email = document.getElementById('addEmail').value.trim();
  const department = document.getElementById('addDepartment').value.trim();
  const role = document.getElementById('addRole').value.trim();

  // Validate form
  if (!firstName || !lastName || !email || !department || !role) {
    alert('Please fill in all fields');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  // Check if email already exists
  const emailExists = employeeData.some(emp => emp.mail.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    alert('An employee with this email already exists');
    return;
  }

  // Create new employee object
  const newEmployee = {
    id: Math.max(...employeeData.map(emp => emp.id)) + 1, // Generate unique ID
    name: `${firstName[0].toUpperCase()+firstName.slice(1,firstName.length)} ${lastName[0].toUpperCase()+lastName.slice(1,lastName.length)}`,
    mail: email,
    department: department,
    role: role
  };

  // Check if an employee with the same details already exists
  const duplicate = employeeData.some(emp =>
    emp.name.toLowerCase() === `${firstName} ${lastName}`.toLowerCase() &&
    emp.mail.toLowerCase() === email.toLowerCase() &&
    emp.department.toLowerCase() === department.toLowerCase() &&
    emp.role.toLowerCase() === role.toLowerCase()
  );

  if (duplicate) {
    alert('An employee with the same information already exists!');
    return;
  }

  // Add to employee data array
  employeeData.push(newEmployee);
  saveEmployeeData();

  // Re-render the list
  renderEmployeeList();

  // Close modal and reset form
  addEmployeeModal.hide();
  
  // Reset form fields
  document.getElementById('addFirstName').value = '';
  document.getElementById('addLastName').value = '';
  document.getElementById('addEmail').value = '';
  document.getElementById('addDepartment').value = '';
  document.getElementById('addRole').value = '';
});

const employeeForm = document.getElementById("employeeForm");

employeeForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = Number(document.getElementById("employeeId").value);
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value.trim();
  const role = document.getElementById("role").value.trim();

  const fullName = `${firstName} ${lastName}`;

  const index = employeeData.findIndex(emp => emp.id === id);
  if (index !== -1) {
    employeeData[index].name = fullName;
    employeeData[index].mail = email;
    employeeData[index].department = department;
    employeeData[index].role = role;
  }

  saveEmployeeData();
  renderEmployeeList();
  employeeModal.hide();
  employeeForm.reset();
});


// Pagination variables
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let currentData = []; // This will hold the filtered/sorted data

// Get pagination elements
const pageSelect = document.getElementById('page');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNumbers = document.getElementById('pageNumbers');
const paginationInfo = document.getElementById('paginationInfo');

// Pagination functions
function calculatePagination(data) {
  totalPages = Math.ceil(data.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages);
  if (currentPage < 1) currentPage = 1;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return data.slice(startIndex, endIndex);
}

function updatePaginationControls() {
  // Update Previous/Next buttons
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  
  // Update pagination info
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, currentData.length);
  paginationInfo.textContent = `Showing ${startIndex}-${endIndex} of ${currentData.length} employees`;
  
  // Generate page numbers
  generatePageNumbers();
}

function generatePageNumbers() {
  pageNumbers.innerHTML = '';
  
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // Add first page and ellipsis if needed
  if (startPage > 1) {
    addPageNumber(1);
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'px-2';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }
  }
  
  // Add visible page numbers
  for (let i = startPage; i <= endPage; i++) {
    addPageNumber(i);
  }
  
  // Add last page and ellipsis if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'px-2';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }
    addPageNumber(totalPages);
  }
}

function addPageNumber(pageNum) {
  const pageBtn = document.createElement('button');
  pageBtn.className = `btn btn-sm mx-1 ${pageNum === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
  pageBtn.textContent = pageNum;
  pageBtn.addEventListener('click', () => goToPage(pageNum));
  pageNumbers.appendChild(pageBtn);
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages && page !== currentPage) {
    currentPage = page;
    renderCurrentPage();
  }
}

function renderCurrentPage() {
  // Apply filters, search, and sort to get current data
  let dataToProcess = employeeData;
  
  // Apply filters
  if (currentFilters.firstname || currentFilters.department || currentFilters.role) {
    dataToProcess = dataToProcess.filter(emp => {
      const firstName = emp.name.split(' ')[0].toLowerCase();
      const department = emp.department.toLowerCase();
      const role = emp.role.toLowerCase();

      const matchesFirstname = !currentFilters.firstname || firstName.includes(currentFilters.firstname);
      const matchesDepartment = !currentFilters.department || department === currentFilters.department;
      const matchesRole = !currentFilters.role || role === currentFilters.role;

      return matchesFirstname && matchesDepartment && matchesRole;
    });
  }
  
  // Apply search
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm) {
    dataToProcess = dataToProcess.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.mail.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply sorting
  dataToProcess = sortEmployees(dataToProcess);
  
  // Store current data for pagination
  currentData = dataToProcess;
  
  // Calculate pagination
  const paginatedData = calculatePagination(currentData);
  
  // Render the current page
  renderEmployeeList(paginatedData);
  
  // Update pagination controls
  updatePaginationControls();
}

// Event listeners for pagination
prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));

// Items per page change
pageSelect.addEventListener('change', function() {
  itemsPerPage = parseInt(this.value);
  currentPage = 1; // Reset to first page
  renderCurrentPage();
});

// Update existing functions to use pagination
function applySorting() {
  renderCurrentPage();
}

// Update search functionality
searchInput.addEventListener('input', function() {
  currentPage = 1; // Reset to first page when searching
  renderCurrentPage();
});

// Update filter functionality
applyFilterBtn.addEventListener('click', function() {
  currentPage = 1; // Reset to first page when filtering
  renderCurrentPage();
  
  // Close the filter sidebar
  const filterOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasRight'));
  if (filterOffcanvas) {
    filterOffcanvas.hide();
  }
});

resetFilterBtn.addEventListener('click', function() {
  currentPage = 1; // Reset to first page when resetting filters
  renderCurrentPage();
});

// Update sort functionality
sortSelect.addEventListener('change', function() {
  const selectedValue = this.value;
  
  if (selectedValue === 'select') {
    currentSort.field = '';
    currentSort.direction = 'asc';
  } else if (selectedValue === 'firstname') {
    if (currentSort.field === 'firstname') {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.field = 'firstname';
      currentSort.direction = 'asc';
    }
  } else if (selectedValue === 'department') {
    if (currentSort.field === 'department') {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.field = 'department';
      currentSort.direction = 'asc';
    }
  }

  updateSortDropdownText();
  renderCurrentPage();
});

// Update the initial render
renderCurrentPage();



