// ************************************
// ************************************
// *****        CLIENTES      *********
// ************************************
// ************************************


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

// ************************************
// ************************************
// *****      PROFISSIONAIS   *********
// ************************************
// ************************************


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




// ************************************
// ************************************
// *****      AGENDAMENTO     *********
// ************************************
// ************************************


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

// Função para consultar agendamentos
function consultarAgendamentos(event) {
    event.preventDefault();

    const cpfCliente = document.getElementById("cpfCliente").value;
    const cpfProfissional = document.getElementById("cpfProfissional").value;
    const data = document.getElementById("dataAgendamento").value;

    const tabelaAgendamentos = document.getElementById("tabelaAgendamentos").querySelector("tbody");
    tabelaAgendamentos.innerHTML = "";

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
                row.insertCell(0).innerText = agendamento.id;
                row.insertCell(1).innerText = agendamento.data;
                row.insertCell(2).innerText = agendamento.horario;
                row.insertCell(3).innerText = agendamento.sala;
                row.insertCell(4).innerText = agendamento.nome_cliente;
                row.insertCell(5).innerText = agendamento.nome_profissional;
                

                const actionsCell = row.insertCell(6);
                actionsCell.innerHTML = `
                    <button onclick="excluirAgendamento('${agendamento.id}')">Excluir</button>
                    <button onclick="carregarAgendamentoParaEdicao('${agendamento.id}')">Editar</button>
                `;
            });

            if (agendamentos.length === 0) {
                const row = tabelaAgendamentos.insertRow();
                row.insertCell(0).colSpan = 5;
                row.cells[0].innerText = "Nenhum agendamento encontrado.";
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            const row = tabelaAgendamentos.insertRow();
            row.insertCell(0).colSpan = 5;
            row.cells[0].innerText = "Erro ao consultar agendamentos.";
        });
}


// Função para excluir agendamento
async function excluirAgendamento(id) {
    try {
        const response = await fetch(`/excluir-agendamento?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir agendamento');
        alert('Agendamento excluído com sucesso!');
        consultarAgendamentos(new Event('submit')); // Atualiza a lista após exclusão
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir agendamento');
    }
}

// Fazer a chamada no bando de dados para carregar agendamento para edição no formulário
async function carregarAgendamentoParaEdicao(id) {
    try {
        const response = await fetch(`/buscar-agendamento?id=${id}`);
        if (!response.ok) throw new Error('Erro ao buscar agendamento');
        const agendamento = await response.json();

        // Preenche os campos do formulário com os dados do agendamento
        document.getElementById('dataAgendamento').value = agendamento.data;
        document.getElementById('horarioAgendamento').value = agendamento.horario;
        document.getElementById('salaAgendamento').value = agendamento.sala;
        document.getElementById('cpfCliente').value = agendamento.cpf_cliente;
        document.getElementById('cpfProfissional').value = agendamento.cpf_profissional;

        // Armazena o ID do agendamento para usá-lo na atualização
        document.getElementById('formCadastroAgendamento').setAttribute('data-id', agendamento.id);

        // Exibe o botão de atualização
        document.getElementById('btnAtualizarAgendamento').style.display = 'inline-block';
    } catch (error) {
        console.error('Erro ao carregar agendamento para edição:', error);
        alert('Erro ao carregar agendamento para edição');
    }
}

// Função para atualizar agendamento mandando novos dados para o bando de dados
async function atualizarAgendamento() {
    const id = document.getElementById('formCadastroAgendamento').getAttribute('data-id');
    const data = document.getElementById('dataAgendamento').value;
    const horario = document.getElementById('horarioAgendamento').value;
    const sala = document.getElementById('salaAgendamento').value;
    const cpf_cliente = document.getElementById('cpfCliente').value;
    const cpf_profissional = document.getElementById('cpfProfissional').value;

    try {
        const response = await fetch(`/atualizar-agendamento`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, data, horario, sala, cpf_cliente, cpf_profissional })
        });

        if (!response.ok) throw new Error('Erro ao atualizar agendamento');
        alert('Agendamento atualizado com sucesso!');

        // Oculta o botão de atualização e limpa o formulário
        document.getElementById('btnAtualizarAgendamento').style.display = 'none';
        document.getElementById('formCadastroAgendamento').reset();
        consultarAgendamentos(new Event('submit')); // Atualiza a lista de agendamentos
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        alert('Erro ao atualizar agendamento');
    }
}



