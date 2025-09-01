// Painel administrativo: login simples e gerenciamento das solicitações (localStorage)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'troca2025';

function renderLogin() {
  document.getElementById('adminApp').innerHTML = `
    <form id="loginForm">
      <h2>Acesso Administrativo</h2>
      <label for="user">Usuário</label>
      <input type="text" id="user" autocomplete="username" required>
      <label for="pass">Senha</label>
      <input type="password" id="pass" autocomplete="current-password" required>
      <button type="submit">Entrar</button>
      <div id="loginError" style="color:#c62828;margin-top:1em;"></div>
    </form>
  `;
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const u = document.getElementById('user').value.trim();
    const p = document.getElementById('pass').value;
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      localStorage.setItem('adminLogged', 'true');
      renderPanel();
    } else {
      document.getElementById('loginError').textContent = 'Usuário ou senha inválidos.';
    }
  };
}

function renderPanel() {
  if (localStorage.getItem('adminLogged') !== 'true') { renderLogin(); return; }
  let solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
  let html = `
    <div class="admin-container">
      <h2>Painel de Gerenciamento</h2>
      <button class="logout-btn" onclick="logoutAdmin()">Sair</button>
      <table class="solicitacoes-table">
        <thead>
          <tr>
            <th>Solicitante</th>
            <th>Substituto</th>
            <th>Tipo</th>
            <th>Datas</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
  `;
  if (solicitacoes.length === 0) {
    html += `<tr><td colspan="6" style="text-align:center;color:#888;">Nenhuma solicitação registrada.</td></tr>`;
  } else {
    solicitacoes.forEach((s, idx) => {
      let datas = '';
      if (s.tipo === 'Troca de plantão') {
        datas = `
          Trabalhar S: ${s.datas.dataTrabalharSolicitante}<br>
          Folgar S: ${s.datas.dataFolgarSolicitante}<br>
          Trabalhar Subst: ${s.datas.dataTrabalharSubstituto}<br>
          Folgar Subst: ${s.datas.dataFolgarSubstituto}
        `;
      } else {
        datas = `Plantão passado: ${s.datas.dataPlantaoPassado}`;
      }
      html += `<tr>
        <td>${s.solicitante.nome}<br><small>${s.solicitante.email}</small></td>
        <td>${s.substituto.nome}<br><small>${s.substituto.email}</small></td>
        <td>${s.tipo}</td>
        <td>${datas}</td>
        <td class="status-${s.status.toLowerCase()}">${s.status}</td>
        <td class="admin-actions">
          ${s.status === 'Pendente'
            ? `<button onclick="aprovarSolic(${idx})">Aprovar</button>
               <button onclick="rejeitarSolic(${idx})">Rejeitar</button>`
            : `<button onclick="reverterSolic(${idx})">Reverter</button>`
          }
        </td>
      </tr>`;
    });
  }
  html += `</tbody></table></div>`;
  document.getElementById('adminApp').innerHTML = html;
}

function aprovarSolic(idx) {
  let solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
  solicitacoes[idx].status = 'Aprovada';
  localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
  renderPanel();
}
function rejeitarSolic(idx) {
  let solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
  solicitacoes[idx].status = 'Rejeitada';
  localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
  renderPanel();
}
function reverterSolic(idx) {
  let solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
  solicitacoes[idx].status = 'Pendente';
  localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
  renderPanel();
}
function logoutAdmin() {
  localStorage.removeItem('adminLogged');
  renderLogin();
}
window.aprovarSolic = aprovarSolic;
window.rejeitarSolic = rejeitarSolic;
window.reverterSolic = reverterSolic;
window.logoutAdmin = logoutAdmin;

window.addEventListener('DOMContentLoaded', function () {
  renderPanel();
});