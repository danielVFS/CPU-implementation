// declarando variaveis
// testando funcionalidade do git
// adicionando mais uma linha para teste

var memoria = [];
var pc = 0;
var mbr;
var mar;
var ir;
var ro0;
var ro1;
var imm;
var acc;

var registradores = new Array(8);

var e;
var l;
var g;

// mascaras
var mascReg0 = 0xe00000;
var mascReg1 = 0x1c0000;
var mascAdress = 0x1fffff;

// conversões OK - Testadas com sucesso
// função para converter o valor do textarea
function converter() {
  var instructionCode = document.getElementById("textAreaOriginal").value;
  var instructions = instructionCode.toLowerCase().split("\n");
  var acumulator = "";
  var instructionWord = "";
  var memoryAddress = "";
  var reg0;
  var reg1;
  var imm;

  for (const instruction of instructions) {
    if (instruction != null) {
      var aux = instruction.split(" ");
      var opcode = aux[0];

      opcode = opcodeToHexa.get(aux[0]) ? opcodeToHexa.get(aux[0]) : null; // No método Map, é possivel utilizar o .get para pegar valores no array

      opcode = opcode << 24; // deslocando 24 bits;

      // no caso de ser o hlt
      if (aux[1] == null) {
        instructionWord = 0;
        //console.log(instructionWord);
      } else if (aux[2] == null) {
        // em casos onde se tem apenas o opcode e a instrução
        memoryAddress = parseInt(aux[1], 16); // passando para hexa
        memoryAddress = memoryAddress & mascAdress;

        instructionWord = opcode | memoryAddress; // formando a instrução
      } else {
        // em caso de ser ld ou st, onde se tem um registrador
        if (opcode == 0x01 << 24 || opcode == 0x02 << 24) {
          reg0 = aux[1].slice(0, 2); // eliminando a virgula
          reg0 = regToDec.get(reg0);
          reg0 = reg0 << 21; // deslocando para pegar o valor do reg
          reg0 = reg0 & mascReg0;

          memoryAddress = parseInt(aux[2], 16); // passando para hexa
          memoryAddress = memoryAddress & mascAdress;

          console.log(`${opcode} + ${reg0} + ${memoryAddress}`);

          instructionWord = opcode | reg0 | memoryAddress;
          //console.log(instructionWord);
        }
        // em casos de add, sub, mul, div, cmp
        else if (
          (opcode > 0x02 << 24 && opcode < 0x07 << 24) ||
          opcode == 0x09 << 24 ||
          opcode == 0x17 << 24
        ) {
          reg0 = aux[1].slice(0, 2); // eliminando a virgula
          reg1 = aux[2].slice(0, 2); // eliminando a virgula
          reg0 = regToDec.get(reg0);
          reg1 = regToDec.get(reg1);

          reg0 = reg0 + mascReg0;
          reg1 = reg1 + mascReg1;

          // deslocando
          reg0 = reg0 << 21;
          reg1 = reg1 << 18;

          //console.log(`${opcode} + ${reg0} + ${reg1}`);

          instructionWord = opcode | reg0 | reg1;
          //console.log(instructionWord);
        }
        // em casos de lsh, rsh, movih, movil, addi, subi, muli, divi, movrr
        else {
          reg0 = aux[1].slice(0, 2); //eliminando a virgula
          reg0 = regToDec.get(reg0);
          reg0 = reg0 + mascReg0;
          reg0 = reg0 << 21;

          imm = parseInt(aux[2], 16);
          imm = imm & mascAdress; // utilizando a mesma mascara do endereço de memória

          instructionWord = opcode + reg0 + imm;
        }
      }

      // convertendo para string apenas para mostrar na tela
      var visualInstruction = instructionWord;
      visualInstruction = preencherBits(
        instructionWord.toString(16).toUpperCase(),
        8
      );

      // apenas para mostrar no text area
      acumulator = acumulator + visualInstruction + "\n";
    }
  }

  document.getElementById("textAreaConvertido").value = acumulator;
}

// Funçaõ responsável por colocar os valores convertidos para a memória
function submeter() {
  var instruction = document.getElementById("textAreaConvertido").value;
  var instructions = instruction.split("\n");

  // contador auxiliar para gravar na memória
  var contador = 0;

  instructions.forEach((instruction) => {
    if (instruction != "") {
      var input = document.getElementById(`${contador}`);

      input.value = instruction;
      memoria[contador] = parseInt(instruction, 16);
      contador++;
    }
  });
}

// funçaõ para preencher com 0s onde está incompleto
function preencherBits(param, bits) {
  while (param.length < bits) {
    param = 0 + param;
  }

  return param;
}

// ao clicar no input, adiciona o valores do input convertido em hexadecimal
// mostra o valor na tela e adiciona na memoria
function changeMenu() {
  var input = event.target;
  var visualValue;
  var virtualValue;

  // em caso de usuário não preencher algum valor;
  if (!input.value) {
    visualValue = "0";
    virtualValue = 0;
  } else {
    visualValue = input.value.toUpperCase();
    virtualValue = parseInt(visualValue, 16);
  }

  //console.log(`${visualValue} - ${virtualValue}`);

  visualValue = preencherBits(visualValue, 8);

  input.value = visualValue;
  memoria[input.id] = virtualValue;
}

/*
  função para executar o ciclo da maquina
  Passo a Passo:
    1. ler a memória
*/
function nextInstruction() {
  // pegando o opcode
  ir = memoria[pc];
  ir = ir >> 24;

  if (ir == 0) {
    //hlt
    return;
  } else if (ir == 1) {
    //ld
    mar = memoria[pc] & 0x1fffff;
    mbr = memoria[mar];

    var reg = memoria[pc] & 0xe00000;
    reg = reg >> 21;

    ro0 = reg;
    registradores[reg] = mbr;
    document.getElementById(`${decToReg.get(reg)}`).value = preencherBits(
      mbr.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 2) {
    //st
    mar = memoria[pc] & 0x1fffff;

    var reg = memoria[pc] & 0xe00000;
    reg = reg >> 21;
    ro0 = reg;

    mbr = registradores[ro0];
    memoria[mar] = mbr;

    document.getElementById(`${mar}`).value = preencherBits(
      mbr.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 3) {
    //add
    // não sei oq fazer no mar nesse caso

    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    ro0 = reg1;

    var reg2 = memoria[pc] & 0x1c0000;
    reg2 = reg2 >> 18;
    ro1 = reg2;

    registradores[ro0] = registradores[ro0] + registradores[ro1];
    //mbr = registradores[ro0];
    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[ro0].toString(16).toUpperCase(),
      8
    );
  } else if (ir == 4) {
    //sub
    // não sei oq fazer no mar nesse caso

    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    ro0 = reg1;

    var reg2 = memoria[pc] & 0x1c0000;
    reg2 = reg2 >> 18;
    ro1 = reg2;

    registradores[ro0] = registradores[ro0] - registradores[ro1];
    //mbr = registradores[ro0];
    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[ro0].toString(16).toUpperCase(),
      8
    );
  } else if (ir == 5) {
    //mul
    // não sei oq fazer no mar nesse caso

    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    ro0 = reg1;

    var reg2 = memoria[pc] & 0x1c0000;
    reg2 = reg2 >> 18;
    ro1 = reg2;

    registradores[ro0] = registradores[ro0] * registradores[ro1];
    //mbr = registradores[ro0];
    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[ro0].toString(16).toUpperCase(),
      8
    );
  } else if (ir == 6) {
    //div
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    ro0 = reg1;

    var reg2 = memoria[pc] & 0x1c0000;
    reg2 = reg2 >> 18;
    ro1 = reg2;

    registradores[ro0] = registradores[ro0] / registradores[ro1];
    //mbr = registradores[ro0];
    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[ro0].toString(16).toUpperCase(),
      8
    );
  } else if (ir == 7) {
    //lsh
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    imm = memoria[pc] & 0x1fffff;

    registradores[reg1] = registradores[reg1] << imm;

    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[reg1].toString(16).toUpperCase(),
      8
    );
    document.getElementById("imm").value = preencherBits(
      imm.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 8) {
    //rsh
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    imm = memoria[pc] & 0x1fffff;

    registradores[reg1] = registradores[reg1] >> imm;

    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[reg1].toString(16).toUpperCase(),
      8
    );
    document.getElementById("imm").value = preencherBits(
      imm.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 9) {
    //cmp
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    ro0 = reg1;

    var reg2 = memoria[pc] & 0x1c0000;
    reg2 = reg2 >> 18;
    ro1 = reg2;

    /* ********************************** */
    if (registradores[ro0] == registradores[ro1]) {
      e = 1;
      document.getElementById("e").value = e;
    } else {
      e = 0;
      document.getElementById("e").value = e;
    }

    /* ********************************** */
    if (registradores[ro0] < registradores[ro1]) {
      l = 1;
      document.getElementById("l").value = l;
    } else {
      l = 0;
      document.getElementById("l").value = l;
    }

    /* ********************************** */
    if (registradores[ro0] > registradores[ro1]) {
      g = 1;
      document.getElementById("g").value = g;
    } else {
      g = 0;
      document.getElementById("g").value = g;
    }
  } else if (ir == 10) {
    //je
    if (e == 1) {
      mar = memoria[pc] & 0x1fffff;
      pc = mar - 1;
    }
  } else if (ir == 11) {
    //jne
    if (e == 0) {
      mar = memoria[pc] & 0x1fffff;
      pc = mar - 1;
    }
  } else if (ir == 12) {
    //jl
    if (l == 1) {
      mar = memoria[pc] & 0x1fffff;
      pc = mar - 1;
    }
  } else if (ir == 13) {
    //jle
    if (e == 1 || l == 1) {
      mar = memoria[pc] & 0x1fffff;
      pc = mar - 1;
    }
  } else if (ir == 14) {
    //jg
    if (g == 1) {
      mar = memoria[pc] & 0x1fffff;
      pc = mar - 1;
    }
  } else if (ir == 15) {
    //jge
    if (e == 1 || g == 1) {
      mar = memoria[pc] & 0x1fffff;
      pc = mar - 1;
    }
  } else if (ir == 16) {
    //jmp
    mar = memoria[pc] & 0x1fffff;
    pc = mar - 1;
  } else if (ir == 17) {
    //movih
    var reg1 = memoria[pc] & 0xe00000;

    reg1 = reg1 >> 21;

    ro0 = reg1; // pegando o registrador onde está o valor
    console.log(ro0);

    imm = memoria[pc] & 0x1fffff;

    document.getElementById("imm").value = preencherBits(
      imm.toString(16).toUpperCase(),
      8
    );

    imm = imm << 16;
    reg1 = reg1 & 0xffff;

    reg1 = reg1 | imm;

    registradores[ro0] = reg1;

    document.getElementById(`${decToReg.get(ro0)}`).value = preencherBits(
      registradores[ro0].toString(16).toUpperCase(),
      8
    );
  } else if (ir == 18) {
    //movil
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    imm = memoria[pc] & 0x1fffff; // apenas decodificando

    imm = imm & 0xffff;

    registradores[reg1] = imm;

    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[reg1].toString(16).toUpperCase(),
      8
    );
    document.getElementById("imm").value = preencherBits(
      imm.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 19) {
    //addi
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    imm = memoria[pc] & 0x1fffff;

    registradores[reg1] = registradores[reg1] + imm;
    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[reg1].toString(16).toUpperCase(),
      8
    );
    document.getElementById("imm").value = preencherBits(
      imm.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 20) {
    //subi
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    imm = memoria[pc] & 0x1fffff;

    registradores[reg1] = registradores[reg1] - imm;
    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[reg1].toString(16).toUpperCase(),
      8
    );
    document.getElementById("imm").value = preencherBits(
      imm.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 21) {
    //muli
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    imm = memoria[pc] & 0x1fffff;

    registradores[reg1] = registradores[reg1] * imm;
    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[reg1].toString(16).toUpperCase(),
      8
    );
    document.getElementById("imm").value = preencherBits(
      imm.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 22) {
    //divi
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    imm = memoria[pc] & 0x1fffff;

    registradores[reg1] = registradores[reg1] / imm;
    document.getElementById(`${decToReg.get(reg1)}`).value = preencherBits(
      registradores[reg1].toString(16).toUpperCase(),
      8
    );
    document.getElementById("imm").value = preencherBits(
      imm.toString(16).toUpperCase(),
      8
    );
  } else if (ir == 23) {
    //movrr
    var reg1 = memoria[pc] & 0xe00000;
    reg1 = reg1 >> 21;
    ro0 = reg1;

    var reg2 = memoria[pc] & 0x1c0000;
    reg2 = reg2 >> 18;
    ro1 = reg2;

    registradores[ro0] = registradores[ro1];
    document.getElementById(`${decToReg.get(ro0)}`).value = preencherBits(
      registradores[ro0].toString(16).toUpperCase(),
      8
    );
  }

  // incrementa o contador quando um ciclo termina
  pc++;

  atualizarProcessador(ir, mar, mbr, pc, ro0, ro1, imm);
}

// atualizando o processador a cada ciclo
function atualizarProcessador(ir, mar, mbr, pc, ro0, ro1, imm) {
  document.getElementById("ir").value = preencherBits(
    ir.toString(16).toUpperCase(),
    2
  );
  document.getElementById("mar").value = preencherBits(
    mar.toString(16).toUpperCase(),
    8
  );
  document.getElementById("mbr").value = preencherBits(
    mbr.toString(16).toUpperCase(),
    8
  );
  document.getElementById("pc").value = preencherBits(
    pc.toString(16).toUpperCase(),
    8
  );
  document.getElementById("ro0").value = preencherBits(
    ro0.toString(16).toUpperCase(),
    3
  );
  document.getElementById("ro1").value = preencherBits(
    ro1.toString(16).toUpperCase(),
    3
  );
  document.getElementById("imm").value = preencherBits(
    imm.toString(16).toUpperCase(),
    4
  );
}

// Map de opcodes convertidos para hexa
var opcodeToHexa = new Map([
  ["hlt", 0x00],
  ["ld", 0x01],
  ["st", 0x02],
  ["add", 0x03],
  ["sub", 0x04],
  ["mul", 0x05],
  ["div", 0x06],
  ["lsh", 0x07],
  ["rsh", 0x08],
  ["cmp", 0x09],
  ["je", 0x0a],
  ["jne", 0x0b],
  ["jl", 0x0c],
  ["jle", 0x0d],
  ["jg", 0x0e],
  ["jge", 0x0f],
  ["jmp", 0x10],
  ["movih", 0x11],
  ["movil", 0x12],
  ["addi", 0x13],
  ["subi", 0x14],
  ["muli", 0x15],
  ["divi", 0x16],
  ["movrr", 0x17],
]);

// Map de registradores retornando o decimal
var regToDec = new Map([
  ["r0", 0],
  ["r1", 1],
  ["r2", 2],
  ["r3", 3],
  ["r4", 4],
  ["r5", 5],
  ["r6", 6],
  ["r7", 7],
]);

// Map de registradores retornando o decimal
var decToReg = new Map([
  [0, "r0"],
  [1, "r1"],
  [2, "r2"],
  [3, "r3"],
  [4, "r4"],
  [5, "r5"],
  [6, "r6"],
  [7, "r7"],
]);
