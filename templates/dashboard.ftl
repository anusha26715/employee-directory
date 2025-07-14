<#-- 
  This Freemarker template would be used by a Java backend to render the employee list.
  The 'employees' variable would be passed from the server, and the template would iterate
  over each employee to generate the HTML for the dashboard.
-->
<div id="employee-list-container">
  <#list employees as employee>
    <div class="employee-card" data-employee-id="${employee.id}">
      <h3>${employee.firstName} ${employee.lastName}</h3>
      <p>ID: ${employee.id}</p>
      <p>Email: ${employee.email}</p>
      <p>Department: ${employee.department}</p>
      <p>Role: ${employee.role}</p>
      <button class="edit-btn" data-id="${employee.id}">Edit</button>
      <button class="delete-btn" data-id="${employee.id}">Delete</button>
    </div>
  </#list>
</div>