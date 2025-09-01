document.addEventListener('DOMContentLoaded', function () {
  var radioTroca = document.getElementById('radioTroca');
  var radioPassar = document.getElementById('radioPassar');
  var trocaDatas = document.getElementById('trocaDatas');
  var passarDatas = document.getElementById('passarDatas');

  function alternarDatas() {
    if (radioTroca.checked) {
      trocaDatas.style.display = '';
      passarDatas.style.display = 'none';
      trocaDatas.querySelectorAll('input[type="date"]').forEach(function (el) {
        el.required = true;
      });
      passarDatas.querySelectorAll('input[type="date"]').forEach(function (el) {
        el.required = false;
      });
    } else {
      trocaDatas.style.display = 'none';
      passarDatas.style.display = '';
      trocaDatas.querySelectorAll('input[type="date"]').forEach(function (el) {
        el.required = false;
      });
      passarDatas.querySelectorAll('input[type="date"]').forEach(function (el) {
        el.required = true;
      });
    }
  }

  radioTroca.addEventListener('change', alternarDatas);
  radioPassar.addEventListener('change', alternarDatas);

  var today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(function (el) {
    el.setAttribute('min', today);
  });

  alternarDatas();

  var form = document.getElementById('trocaForm');
  form.addEventListener('submit', function (e) {
    var valido = true;
    var campos = [
      { id: 'nomeSolicitante', erro: 'erroNomeSolicitante', msg: 'Informe seu nome.' },
      { id: 'matSolicitante', erro: 'erroMatSolicitante', msg: 'Informe sua matrícula.' },
      { id: 'emailSolicitante', erro: 'erroEmailSolicitante', msg: 'Informe um e-mail válido.', tipo: 'email' },
      { id: 'setorSolicitante', erro: 'erroSetorSolicitante', msg: 'Informe seu setor.' },
      { id: 'dataSolicitacao', erro: 'erroDataSolicitacao', msg: 'Selecione a data da solicitação.', tipo: 'date' },
      { id: 'nomeSubstituto', erro: 'erroNomeSubstituto', msg: 'Informe o nome do substituto.' },
      { id: 'matSubstituto', erro: 'erroMatSubstituto', msg: 'Informe a matrícula do substituto.' },
      { id: 'emailSubstituto', erro: 'erroEmailSubstituto', msg: 'Informe um e-mail válido para o substituto.', tipo: 'email' }
    ];

    if (radioTroca.checked) {
      campos = campos.concat([
        { id: 'dataTrabalharSolicitante', erro: 'erroDataTrabalharSolicitante', msg: 'Informe a data a trabalhar (solicitante).', tipo: 'date' },
        { id: 'dataFolgarSolicitante', erro: 'erroDataFolgarSolicitante', msg: 'Informe a data a folgar (solicitante).', tipo: 'date' },
        { id: 'dataTrabalharSubstituto', erro: 'erroDataTrabalharSubstituto', msg: 'Informe a data a trabalhar (substituto).', tipo: 'date' },
        { id: 'dataFolgarSubstituto', erro: 'erroDataFolgarSubstituto', msg: 'Informe a data a folgar (substituto).', tipo: 'date' }
      ]);
    } else {
      campos = campos.concat([
        { id: 'dataPlantaoPassado', erro: 'erroDataPlantaoPassado', msg: 'Informe a data do plantão a ser passado.', tipo: 'date' }
      ]);
    }

    var consentimento = document.getElementById('consentimento');
    var erroConsentimento = document.getElementById('erroConsentimento');
    if (!consentimento.checked) {
      erroConsentimento.textContent = 'É necessário concordar com a política de privacidade.';
      valido = false;
    } else {
      erroConsentimento.textContent = '';
    }

    campos.forEach(function (campo) {
      var input = document.getElementById(campo.id);
      var erro = document.getElementById(campo.erro);
      input.classList.remove('erro');
      erro.textContent = '';
      if (!input.value) {
        erro.textContent = campo.msg;
        input.classList.add('erro');
        valido = false;
      } else if (campo.tipo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        erro.textContent = 'E-mail inválido.';
        input.classList.add('erro');
        valido = false;
      } else if (campo.tipo === 'date' && input.value < today) {
        erro.textContent = 'Selecione uma data válida.';
        input.classList.add('erro');
        valido = false;
      }
    });

    if (radioTroca.checked) {
      var d1 = document.getElementById('dataTrabalharSolicitante').value;
      var d2 = document.getElementById('dataFolgarSolicitante').value;
      var d3 = document.getElementById('dataTrabalharSubstituto').value;
      var d4 = document.getElementById('dataFolgarSubstituto').value;
      if (d1 && d2 && d1 === d2) {
        document.getElementById('erroDataFolgarSolicitante').textContent = 'Datas não podem ser iguais.';
        valido = false;
      }
      if (d3 && d4 && d3 === d4) {
        document.getElementById('erroDataFolgarSubstituto').textContent = 'Datas não podem ser iguais.';
        valido = false;
      }
    }

    if (!valido) {
      e.preventDefault();
      return false;
    }

    // _cc agora inclui gestora + substituto
    var emailSubstituto = document.getElementById('emailSubstituto').value.trim();
    var ccInput = document.getElementById('cc');
    ccInput.value = emailSubstituto + ',marianaboccanerapediatra@gmail.com';
    var nextInput = document.getElementById('next');
    nextInput.value = " https://keisystellacarvalho.github.io/trocas-plantao/";
  });

  document.getElementById('trocaForm').addEventListener('submit', function (e) {
    setTimeout(function () {
      var erro = document.querySelector('.erro:not(:empty)');
      if (erro) erro.previousElementSibling.focus();
    }, 50);
  });
});