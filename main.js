var memoria = [];

// função para converter o valor do textarea
function converter() {
  var instructionCode = document.getElementById("textAreaOriginal").value;
  var instructions = instructionCode.toLowerCase().split("\n");
  var acumulator = "";
  var instructionWord = "";

  for (const instruction of instructions) {
    if(instruction != null) {
      var aux = instruction.split(" ");
      var opcode = aux[0];
      opcode = opcodeToHexa.get(opcode) ? opcodeToHexa.get(opcode) : null; // No método Map, é possivel utilizar o .get para pegar valores no array
      if(!opcode) {
        alert(`Comando inexistente:${aux[0]}`);
        return;
      };
      var memoryAddress = Number(aux[1]).toString(16).toUpperCase(); // passando para hexa

      while(memoryAddress.length < 6) {
        memoryAddress = "0" + memoryAddress;
      }

      if(opcode == "00000000") { // no caso de ser o hlt
        instructionWord = opcode;
      } else {
        instructionWord = (opcode + memoryAddress); // formando a instrução
      }

      acumulator = acumulator + instructionWord + "\n"; 
    }
  }

  document.getElementById('textAreaConvertido').value = acumulator;
}

// Map de opcodes convertidos para hexa
var opcodeToHexa = new Map([
  ["hlt", "00000000"],
  ["ld", "01"],
  ["st", "02"],
  ["add", "03"],
  ["sub", "04"],
  ["mul", "05"],
  ["div", "06"],
  ["lsh", "07"],
  ["rsh", "08"],
  ["cmp", "09"],
  ["je", "0A"],
  ["jne", "0B"],
  ["jl", "0C"],
  ["jle", "0D"],
  ["jg", "0E"],
  ["jge", "0F"],
  ["jmp", "10"],
  ["movih", "11"],
  ["movil", "12"],
  ["addi", "13"],
  ["subi", "14"],
  ["multi", "15"],
  ["divi", "16"],
  ["movrr", "17"],
]);

function submeter() {
  alert(1);
}

// ao clicar no input, adiciona o valores do input convertido em hexadecimal
function changeMenu() {
  var element = event.target;

  var number = Number(element.value).toString(16).toUpperCase();
  
  while(number.length < 8) {
    number = "0" + number;
  }

  element.value = number;
}