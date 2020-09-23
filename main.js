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

      while(memoryAddress.length < 8) {
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
  ["ld", "0x01000000"],
  ["st", "0x02000000"],
  ["add", "0x03000000"],
  ["sub", "0x04000000"],
  ["mul", "0x05000000"],
  ["div", "0x06000000"],
  ["lsh", "0x07000000"],
  ["rsh", "0x08000000"],
  ["cmp", "0x09000000"],
  ["je", "0x0A000000"],
  ["jne", "0x0B000000"],
  ["jl", "0x0C000000"],
  ["jle", "0x0D000000"],
  ["jg", "0x0E000000"],
  ["jge", "0x0F000000"],
  ["jmp", "0x10000000"],
  ["movih", "0x11000000"],
  ["movil", "0x12000000"],
  ["addi", "0x13000000"],
  ["subi", "0x14000000"],
  ["multi", "0x15000000"],
  ["divi", "0x16000000"],
  ["movrr", "0x17000000"],
]);

function submeter() {
  alert(1);
}