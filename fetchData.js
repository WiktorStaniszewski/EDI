async function fetchAndDisplayData() {
    const apiKey = '84223600'; // Will change when proper schema will be used
    const apiUrl = `https://my.api.mockaroo.com/users.json?key=${apiKey}`;
    const y = document.getElementById("scrollable");
    try { // If mockaroo servers fail for any reason
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (y.style.display == "none") { // if clicked first time it will be shown
        y.style.display = "block";
      }
      
      // Generate table and display data function
      displayDataInTable(data);

      //create graphs - P
      createGraphs(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  function hideandshow() {
    const y = document.getElementById("scrollable");
    const x = document.getElementById("cover");
    if (y.style.display == "none") {  // This makes onclick- display and hide the section
      y.style.display = "block";
    } else {
      y.style.display = "none";
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







//    m o j e   b a g n o      - P

/* czyli co muszę zrobić:
          mam pomysł na 2 wykresy - wykres kołowy pokazujący jaki procent całego dorobku daje jeden album konkretnego zespołu/autora
          drugi wykres - wykres liniowy pokazujący na przestrzeni lat jakie były najpopularniejsze zespoły - jake był najwięcej słuchane

          więc - do pierwszego potrzebuję dane: album, zespół/autor, zysk
          do drugiego - : zespół/autor, album, popularność, rok_Wydania
          minimalne dane zatem to: - album, zespół/autor/ zysk/popularność, rok_wydania 
    */
/*

      poza tym - będe pracował na zmiennych globalnych
      czy da się bez nich - pewnie i tak
      ale czy muszę?
*/


//globalne zmienne, dla grafów i rzeczy jakie będą one używać 
var chart1, chart2
var global_data, album_list, band_list

var noted_years = [], top_album_scores = [], top_album_names = [];
//to pewnie jest głupie, ale działa - więc nie jest głupie

  
  function createGraphs(data){
    //tutaj wszystko jest przygotowywane na utworzenie od zera 2 pierwszych wykresów

    global_data = data //i święty spokój
    album_list = []
    band_list = []
    //wyciągam teraz elementy z listy jakie potrzebuję. Chyba. Być może 
    for (i=0;i<data.length;i++){album_list.push(data[i].Album_name)}
    for (i=0;i<data.length;i++){
        if (!band_list.includes(data[i].Band_name))   {band_list.push(data[i].Band_name)}
    }
    //console.log(album_list)
    //console.log(band_list)
    /*
        psychoza poniżej
        dużo console.log() tam mam w komentarzach, one są dla testów, nie przejmujcie się nimi
    */
    //wykres nr 1

    //do selecta dodaj wszystkie zespoły
    var select_tag = document.getElementById("bands");
    select_tag.style.display = "block"
    select_tag.innerHTML="";
    selected_band = band_list[0]
    for (i=0;i<band_list.length;i++){
      select_tag.innerHTML+="<option value = "+band_list[i].replaceAll(" ", "_")+">"+band_list[i]+"</option>"
    }

    //ogarnij dane do wykresu
   graph_data = []
   graph_labels=[]
    for (i=0;i<data.length;i++){
      if (data[i].Band_name == selected_band){
        graph_labels.push(data[i].Album_name)
        graph_data.push(data[i].Album_earnings)
      }
    }
    //rysuj wykres 1
    drawGraph1(graph_labels,graph_data)

    //wykres 2
    //sprawdź wszystkie unikalne lata - bez dni czy miesięcy

    for (i=0;i<data.length;i++){
      temp = data[i].Release_date;
      temp = temp.substr(6,4)
      if (!noted_years.includes(temp))   {noted_years.push(temp)}
    }
    noted_years.sort()
    //dla każdego roku, przejrzyj wszystkie albumy wtedy wydane
    //największy z nich weź i dodaj to top listy
    for (i=0;i<noted_years.length;i++){
      temp_storage = []
      for (j=0;j<data.length;j++){
        if (noted_years[i]==data[j].Release_date.substr(6,4)){
          temp_storage.push(data[j].Album_rating);
        }
        temp_storage.sort();
        temp_storage.reverse();
      }
      top_album_scores.push(temp_storage[0])
    }
    for (i=0;i<noted_years.length;i++){
      for (j=0;j<data.length;j++){
        if (noted_years[i]==data[j].Release_date.substr(6,4) && top_album_scores[i] == data[j].Album_rating){
          top_album_names.push(data[j].Album_name);
        }
      }
    }
    //console.log(top_album_names);

    drawGraph2(noted_years,top_album_scores, top_album_names)
  }

  //to będzie po zmianie aktualizować wykres 1
  function updateGraph1(data){
    var select_tag = document.getElementById("bands")
    selected_band = select_tag.options[select_tag.selectedIndex].value.replaceAll("_"," ");
    var graph_labels = [], graph_data = []
    //console.log(selected_band)
    for (i=0;i<global_data.length;i++){
      //console.log(global_data[i].Band_name, selected_band)
      if (global_data[i].Band_name == selected_band){
        //console.log(global_data[i].Album_name)
        graph_labels.push(global_data[i].Album_name)
        graph_data.push(global_data[i].Album_earnings)
      }
    }
    //console.log(graph_data, graph_labels)
    drawGraph1(graph_labels, graph_data)
  }
  //rysu rysu
  function drawGraph1(labels, datas){
    //przypisz 3 wariacje czerwonego już istniejące na stronie
    var graph_colors = [];
    for (i=0;i<labels.length;i++){
      if ((i+1)%3==1){graph_colors.push("#e7c1be")}
      if ((i+1)%3==2){graph_colors.push("#625e5e")}
      if ((i+1)%3==0){graph_colors.push("#232121")}
    }
    if ((graph_colors.length)%3==1){graph_colors[graph_colors.length-1]='#833833'}
    //console.log(graph_colors)
    var canvas = document.getElementById("graph1");
    if (canvas.style.display == "none") canvas.style.display = "block";
    var config = {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            borderColor: '#e7c1be',
            backgroundColor: graph_colors,
            label: 'earnings (thou.)',
            data: datas,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      
    }
    Chart.defaults.color = "#FFF";

     if (chart1) chart1.destroy();
    chart1 = new Chart(canvas, config);
  }
  
  function drawGraph2(dates, datas, albums){
    //niech mnie ktoś uderzy patelnią teflonową
    // chciałem dodać 2 labele: jeden z rokiem, drugi z nazwą zespołu
    // oddzielnie, aby nie wyświetlały się razem
    //... rozniesie mnie coś za chwilę, to po prostu złączyłem je w inną tablicę, więc jest nasypane tekstem pod wykresem
    var rating_name_combined = [];
    for (i=0;i<dates.length;i++){
      rating_name_combined.push(albums[i]+" , "+dates[i])
    }
    
    //console.log(rating_name_combined);

    var canvas = document.getElementById("graph2");
    if (canvas.style.display == "none") canvas.style.display = "block";
    var config = {
        type: 'line',
        data: {
          labels: rating_name_combined,
          datasets: [{
            label: albums[Chart.dataIndex],
            borderColor: '#e7c1be',
            backgroundColor: '#833833',
            data: datas,
            borderWidth: 1,
            showLine: false,
            pointStyle: 'circle',
            pointRadius: 8,
            pointHoverRadius: 16
          }]
          
        },
        options: {
          plugins: {
            legend: {
                display: false
            }
        },
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      
    }
    Chart.defaults.color = "#FFF";

     if (chart2) chart2.destroy();
    chart2 = new Chart(canvas, config);
  }
  
  
