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

      if(opcode == "0x00000000") { // no caso de ser o hlt
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
  ["hlt", "0x00000000"],
  ["ld", "0x01"],
  ["st", "0x02"],
  ["add", "0x03"],
  ["sub", "0x04"],
  ["mul", "0x05"],
  ["div", "0x06"],
  ["lsh", "0x07"],
  ["rsh", "0x08"],
  ["cmp", "0x09"],
  ["je", "0x0A"],
  ["jne", "0x0B"],
  ["jl", "0x0C"],
  ["jle", "0x0D"],
  ["jg", "0x0E"],
  ["jge", "0x0F"],
  ["jmp", "0x10"],
  ["movih", "0x11"],
  ["movil", "0x12"],
  ["addi", "0x13"],
  ["subi", "0x14"],
  ["multi", "0x15"],
  ["divi", "0x16"],
  ["movrr", "0x17"],
]);

function submeter() {
  alert(1);
}