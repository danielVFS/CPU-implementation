var memoria = [];
var pc = 0;

// função para converter o valor do textarea
function converter() {
  var instructionCode = document.getElementById("textAreaOriginal").value;
  var instructions = instructionCode.toLowerCase().split("\n");
  var acumulator = "";
  var instructionWord = 0;
  var memoryAddress = 0;
  var reg0 = "";
  var reg1 = "";
  var nBits = "";

  for (const instruction of instructions) {
    if(instruction != null) {
      var aux = instruction.split(" ");
      var opcode = aux[0];

      opcode = opcodeToHexa.get(aux[0]) ? opcodeToHexa.get(aux[0]) : null; // No método Map, é possivel utilizar o .get para pegar valores no array
      
      opcode = opcode << 24; // deslocando;

      if(!opcode) {
        alert(`Comando inexistente:${aux[0]}`);
        return;
      };
      
      if(opcode == "hlt") { // no caso de ser o hlt
        instructionWord = 0; // fazendo isso devido a alguns bugs no map
      } 
      else if(aux[2] == null) { // em casos onde se tem apenas o opcode e a instrução
        memoryAddress = parseInt(aux[1], 16); // passando para hexa

        instructionWord = (opcode | memoryAddress); // formando a instrução
      } 
      else {
        // em caso de ser ld ou st, onde se tem um registrador
        if(opcode == 0x01 << 24 || opcode == 0x02 << 24) {
          reg0 = aux[1].slice(0,2); // eliminando a virgula
          reg0 = regToDec.get(reg0);
          
          reg0 = reg0 << 12; // deslocando para pegar o valor do reg

          memoryAddress = parseInt(aux[2], 16); // passando para hexa

          console.log(`${opcode} + ${reg0} + ${memoryAddress}`);

          instructionWord = (opcode | reg0 | memoryAddress);
        }
        // em casos de add, sub, mul, div, cmp
        else if(opcode > 0x02 << 24 && opcode < 0x07 << 24|| opcode == 0x09 << 24 || opcode == 0x17 << 24){
          reg0 = aux[1].slice(0,2); // eliminando a virgula
          reg1 = aux[2].slice(0,2); // eliminando a virgula
          reg0 = regToDec.get(reg0);
          reg1 = regToDec.get(reg1);
      
          // deslocando
          reg0 = reg0 << 12;
          console.log(`${opcode} + ${reg0} + ${reg1}`);

          instructionWord = (opcode | reg0 | reg1);
        }
        // em casos de lsh, rsh, movih, movil, addi, subi, muli, divi, movrr
        else {
          reg0 = aux[1].slice(0, 2); //eliminando a virgula
          reg0 = regToDec.get(reg0);
          nBits = Number(aux[2]).toString(16).toUpperCase(); // deve ser passado para o hexa ???????????

          nBits = preencherBits(nBits, 3)
          instructionWord = (opcode + reg1 + nBits);
        }
      }

      // convertendo para string apenas para mostrar na tela
      var visualInstruction = instructionWord;
      visualInstruction = preencherBits(instructionWord.toString(16).toUpperCase(), 8);
      acumulator = acumulator + visualInstruction + "\n";

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
    param = 0 + param;
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

// função para executar o ciclo da maquina
function execCicle() {
  alert(1);
}

// Map de opcodes convertidos para hexa
var opcodeToHexa = new Map([
  ["ld", 0x01],
  ["st", 0x02],
  ["add", 0x03],
  ["sub", 0x04],
  ["mul", 0x05],
  ["div", 0x06],
  ["lsh", 0x07],
  ["rsh", 0x08],
  ["cmp", 0x09],
  ["je", 0x0A],
  ["jne", 0x0B],
  ["jl", 0x0C],
  ["jle", 0x0D],
  ["jg", 0x0E],
  ["jge", 0x0F],
  ["jmp", 0x10],
  ["movih", 0x11],
  ["movil", 0x12],
  ["addi", 0x13],
  ["subi", 0x14],
  ["muli", 0x15],
  ["divi", 0x16],
  ["movrr", 0x17],
]);

// Map de registradores retornando o codigo binario
var regToDec = new Map([
  ["r0", 0x0],
  ["r1", 0x1],
  ["r2", 0x2],
  ["r3", 0x3],
  ["r4", 0x4],
  ["r5", 0x5],
  ["r6", 0x6],
  ["r7", 0x7],
]);

