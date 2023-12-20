
async function fetchAndDisplayData() {
    const apiKey = '84223600'; // Will change when proper schema will be used
    const apiUrl = `https://my.api.mockaroo.com/users.json?key=${apiKey}`;
    const y = document.getElementById("scrollable");
    const x = document.getElementById("cover");
    if (y.style.display == "none") {  // This makes onclick- display and hide the section
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
    try { // If mockaroo servers fail for any reason
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      // Generate table and display data function
      displayDataInTable(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Function to display data in a table on the webpage
  function displayDataInTable(data) {
    const table = document.getElementById('data');
    table.innerHTML = '';
  
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
  
      // Create table headers
      const headerRow = table.createTHead().insertRow();
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
  
      // Populate table rows with data
      data.forEach(item => {
        const row = table.insertRow();
        headers.forEach(header => {
          const cell = row.insertCell();
          cell.textContent = item[header];
        });
      });
    }
  }
  