var memoria = [];
var pc = 0;

// função para converter o valor do textarea
function converter() {
  var instructionCode = document.getElementById("textAreaOriginal").value;
  var instructions = instructionCode.toLowerCase().split("\n");
  var acumulator = "";
  var instructionWord = "";
  var memoryAddress = "";
  var reg1 = "";
  var reg2 = "";
  var nBits = "";

  for (const instruction of instructions) {
    if(instruction != null) {
      var aux = instruction.split(" ");
      var opcode = aux[0];
      opcode = opcodeToHexa.get(opcode) ? opcodeToHexa.get(opcode) : null; // No método Map, é possivel utilizar o .get para pegar valores no array
      if(!opcode) {
        alert(`Comando inexistente:${aux[0]}`);
        return;
      };

      if(opcode == "00000000") { // no caso de ser o hlt
        instructionWord = opcode;
      } 
      else if(aux[2] == null) { // em casos onde se tem apenas o opcode e a instrução
        memoryAddress = Number(aux[1]).toString(16).toUpperCase(); // passando para hexa
        
        memoryAddress = preencherBits(memoryAddress, 6)
        instructionWord = (opcode + memoryAddress); // formando a instrução
      } 
      else {
        if(opcode == "01" || opcode == "02") { // em caso de ser ld ou st, onde se tem um registrador
          reg1 = regToBin.get(aux[1]);
          memoryAddress = Number(aux[2]).toString(16).toUpperCase(); // passando para hexa
          
          memoryAddress = preencherBits(memoryAddress, 3)
          instructionWord = (opcode + reg1 + memoryAddress);
        }
        // em casos de add, sub, mul, div, cmp
        else if(opcode > 2 && opcode < 7 || opcode == 9){
          reg1 = regToBin.get(aux[1]);
          reg2 = regToBin.get(aux[2]);

          instructionWord = (opcode + reg1 + reg2);
        }
        // em casos de lsh, rsh, movih, movil, addi, subi, muli, divi, movrr
        else {
          reg1 = regToBin.get(aux[1]);
          nBits = Number(aux[2]).toString(16).toUpperCase(); // deve ser passado para o hexa ???????????

          nBits = preencherBits(nBits, 3)
          instructionWord = (opcode + reg1 + nBits);
        }
      }

      acumulator = acumulator + instructionWord + "\n"; 
    }
  }

  document.getElementById('textAreaConvertido').value = acumulator;
}

// contador auxiliar para gravar na memória
var contador = 0;

// Funçaõ responsável por colocar os valores convertidos para a memória
function submeter() {
  var instruction = document.getElementById('textAreaConvertido').value;
  var instructions = instruction.split("\n");

  instructions.forEach((instruction) => {
    if(instruction != "") {
      var input = document.getElementById(`${contador}`);
      input.value = instruction;
      memoria[contador] = instruction;
      contador++;
    }
  });

}

// funçaõ para preencher com 0s onde está incompleto
function preencherBits(param, bits) {
  while(param.length < bits) {
    param = "0" + param;
  }

  return param;
}

// ao clicar no input, adiciona o valores do input convertido em hexadecimal
// mostra o valor na tela e adiciona na memoria
function changeMenu() {
  var element = event.target;

  var number = Number(element.value).toString(16).toUpperCase();
  
  while(number.length < 8) {
    number = "0" + number;
  }

  element.value = number;
  memoria[element.id] = number;
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

// Map de registradores retornando o codigo binario
var regToBin = new Map([
  ["r0", "000"],
  ["r1", "001"],
  ["r2", "010"],
  ["r3", "011"],
  ["r4", "100"],
  ["r5", "101"],
  ["r6", "110"],
  ["r7", "111"],
]);

