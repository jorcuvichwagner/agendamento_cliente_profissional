// Função para cadastrar cliente
async function cadastrarCliente() {
    const nome = document.getElementById('nomeCliente').value;
    const cpf = document.getElementById('cpfCliente').value;

    await fetch('/cadastrar-cliente', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nome, cpf })
    });
    
}

// Função para cadastrar profissional
async function cadastrarProfissional() {
    const nome = document.getElementById('nomeProfissional').value;
    const cpf = document.getElementById('cpfProfissional').value;

    await fetch('/cadastrar-profissional', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nome, cpf })
    });
    alert('Profissional Cadastrado');
}

// Função para cadastrar agendamento
async function cadastrarAgendamento() {
    const data = document.getElementById('dataAgendamento').value;
    const horario = document.getElementById('horarioAgendamento').value;
    const sala = document.getElementById('salaAgendamento').value;
    const cpf_cliente = document.getElementById('cpfCliente').value;
    const cpf_profissional = document.getElementById('cpfProfissional').value;

    await fetch('/cadastrar-agendamento', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ data, horario, sala, cpf_cliente, cpf_profissional })
    });
    alert('Agendamento Cadastrado');
}

function consultarAgendamentos(event) {
    event.preventDefault(); // Previne o envio do formulário

    const cpfCliente = document.getElementById("cpfClienteConsulta").value;
    const cpfProfissional = document.getElementById("cpfProfissionalConsulta").value;
    const data = document.getElementById("dataConsulta").value;

    const tabelaAgendamentos = document.getElementById("tabelaAgendamentos").querySelector("tbody");
    tabelaAgendamentos.innerHTML = ""; // Limpa resultados anteriores

    // Faz a requisição para consultar agendamentos
    const params = new URLSearchParams({
        cpf_cliente: cpfCliente,
        cpf_profissional: cpfProfissional,
        data: data,
    });

    fetch(`/consultar-agendamentos?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na consulta');
            }
            return response.json();
        })
        .then(agendamentos => {
            agendamentos.forEach(agendamento => {
                const row = tabelaAgendamentos.insertRow();
                row.insertCell(0).innerText = agendamento.data;
                row.insertCell(1).innerText = agendamento.horario;
                row.insertCell(2).innerText = agendamento.sala;
                row.insertCell(3).innerText = agendamento.cpf_cliente;
                row.insertCell(4).innerText = agendamento.cpf_profissional;
            });

            if (agendamentos.length === 0) {
                const row = tabelaAgendamentos.insertRow();
                row.insertCell(0).colSpan = 6;
                row.cells[0].innerText = "Nenhum agendamento encontrado.";
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            const row = tabelaAgendamentos.insertRow();
            row.insertCell(0).colSpan = 6;
            row.cells[0].innerText = "Erro ao consultar agendamentos.";
        });
}

