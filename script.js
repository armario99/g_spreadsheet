const spreadSheetContainer = document.querySelector('#spreadsheet-container');

const exportBtn = document.querySelector('#export-btn');

const ROWS = 10;
const COLS = 10;

const spreadsheet = [];

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R','S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class Cell {
    constructor(isHeader, disabled, data, row, column,rowName,columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

exportBtn.onclick = function(e) {
    console.log(spreadsheet);
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++) {
        if(i === 0) continue;
        csv += spreadsheet[i].filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(',') + "\r\n";
    }
    console.log(csv);

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log("csv",csvUrl);

    const fileNameInput = document.getElementById('file_name');
    let fileName = fileNameInput.value.trim();

    // If fileName is empty, use default value
    if (fileName === "") {
        fileName = 'Spreadsheet File Name.csv';
    } else {
        // Add file extension if not provided
        if (!fileName.endsWith('.csv')) {
            fileName += '.csv';
        }
    }

    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = fileName;
    a.click();
}



initSpreadsheet();

function initSpreadsheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {
            let cell_data = '';
            let isHeader = false;
            let disabled = false;
            if (j === 0) {
                cell_data = i;
                isHeader = true;
                disabled = true;
            }

            if (i === 0) {
                cell_data = alphabets[j - 1];
                isHeader = true;
                disabled = true;
            }

            if (!cell_data){
                cell_data = "";
            }
            
            const rowName = i;
            const columnName = alphabets[j - 1];

            const cell = new Cell(isHeader, disabled, cell_data , i,j,rowName,columnName ,false); 
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    console.log(spreadsheet);
}

function createCellEl(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader) {
        cellEl.classList.add('header');
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleCellChange(e.target.value,cell);
    return cellEl;
}

function handleCellClick(cell) {
    clearHeaderActiveState();
    console.log('clicked cell', cell);
    //데이터 가져오기
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    //요소를 가져오기
    const columnHeaderEl = getElFromRowCol(columnHeader.row,columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row,rowHeader.column);

    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');

     // span 요소 가져오기
     const cellStatusSpan = document.getElementById('cell-status');
     console.log('cellpoint' , cellStatusSpan);
     // span의 값을 cell 좌표값으로 설정하기
     cellStatusSpan.textContent = `(${cell.row}, ${alphabets[cell.column-1]})`;
}

function handleCellChange(data,cell) {
    cell.data = data;
}

function getElFromRowCol(row, col){
    return document.querySelector('#cell_' + row + col);
}

function clearHeaderActiveState(){
    const headerEl = document.querySelectorAll('.header');

    headerEl.forEach(header => {
        header.classList.remove('active');
    });
}

function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement('div');
        rowContainerEl.className = "cell-row";


        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            const cellEl = createCellEl(cell);
            rowContainerEl.append(cellEl);
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}