const checklistData = [
    {
        id: "task-1",
        title: "Preencher Formulário de Inscrição (Google Forms)",
        desc: "Obrigatório o uso de e-mail @gmail.com.",
        status: "previsto"
    },
    {
        id: "task-2",
        title: "Digitalizar NUIT",
        desc: "Cópia digitalizada do Número de Identificação Tributária.",
        status: "previsto"
    },
    {
        id: "task-3",
        title: "Histórico Escolar da Graduação",
        desc: "Cópia digitalizada legível em formato PDF.",
        status: "previsto"
    },
    {
        id: "task-4",
        title: "Diploma de Graduação",
        desc: "Cópia digitalizada (frente e verso) em PDF.",
        status: "previsto"
    },
    {
        id: "task-5",
        title: "Currículo Lattes Documentado",
        desc: "Exportar RTF do Lattes. Anexar certificados em arquivo único (PDF).",
        status: "previsto"
    },
    {
        id: "task-6",
        title: "Projeto de Pesquisa",
        desc: "Máx 10 págs. Papel A4, Times New Roman 12. Áreas: Ed. Matemática, Ensino de Ciências ou História/Filosofia da Ciência.",
        status: "previsto"
    },
    {
        id: "task-7",
        title: "Histórico Escolar do Mestrado",
        desc: "Cópia digitalizada legível em formato PDF.",
        status: "previsto"
    },
    {
        id: "task-8",
        title: "Diploma de Mestre",
        desc: "Frente e verso ou certificado de previsão de defesa.",
        status: "previsto"
    }
];

const importantDates = [
    { date: "2026-09-28", endDate: "2026-11-01", title: "Inscrições Abertas", desc: "Envio de documentos via Google Forms até 23h59min (Brasília).", urgentDays: 5 },
    { date: "2026-11-13", title: "Homologação", desc: "Divulgação da homologação das inscrições (após as 16h00).", urgentDays: 2 },
    { date: "2026-11-21", title: "Google Classroom", desc: "Data limite para entrada na sala de aula virtual (até 19h00).", urgentDays: 2 },
    { date: "2027-01-19", title: "1ª Etapa: Prova", desc: "Prova de redação eliminatória (08h30).", urgentDays: 7 },
    { date: "2027-02-15", endDate: "2027-02-26", title: "2ª Etapa", desc: "Análise Lattes, Projeto e Arguição via Meet.", urgentDays: 7 }
];

document.addEventListener("DOMContentLoaded", () => {
    initChecklist();
    initAlerts();
});

function initChecklist() {
    const savedData = JSON.parse(localStorage.getItem("pecem_doutorado_checklist"));
    const tasks = savedData || checklistData;
    
    renderTasks(tasks);
    updateProgress(tasks);

    // Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            filterTasks(filter);
        });
    });
}

function renderTasks(tasks) {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-item";
        div.dataset.status = task.status;
        div.dataset.id = task.id;

        div.innerHTML = `
            <div class="task-info">
                <h4>${task.title}</h4>
                <p>${task.desc}</p>
            </div>
            <div class="task-status">
                <select class="status-select" onchange="changeStatus('${task.id}', this.value)">
                    <option value="previsto" ${task.status === 'previsto' ? 'selected' : ''}>⏳ Previsto</option>
                    <option value="processo" ${task.status === 'processo' ? 'selected' : ''}>⚙️ Em Processo</option>
                    <option value="concluido" ${task.status === 'concluido' ? 'selected' : ''}>✅ Concluído</option>
                </select>
            </div>
        `;
        list.appendChild(div);
    });
}

function changeStatus(id, newStatus) {
    let tasks = JSON.parse(localStorage.getItem("pecem_doutorado_checklist")) || checklistData;
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem("pecem_doutorado_checklist", JSON.stringify(tasks));
        
        // Update DOM element
        const taskEl = document.querySelector(`.task-item[data-id="${id}"]`);
        if (taskEl) {
            taskEl.dataset.status = newStatus;
        }
        
        updateProgress(tasks);
        
        // Respect current filter
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        filterTasks(activeFilter);
    }
}

function updateProgress(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'concluido').length;
    const percent = Math.round((completed / total) * 100);
    
    document.getElementById("progress-text").textContent = `${percent}% Concluído`;
    document.getElementById("progress-fill").style.width = `${percent}%`;
}

function filterTasks(filter) {
    const items = document.querySelectorAll('.task-item');
    items.forEach(item => {
        if (filter === 'all' || item.dataset.status === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function initAlerts() {
    const container = document.getElementById("alerts-container");
    // Simulate current date based on context (Sep 27, 2026)
    const today = new Date("2026-09-27T00:00:00");
    
    let activeAlerts = 0;

    importantDates.forEach(item => {
        const eventDate = new Date(item.date + "T00:00:00");
        let isUrgent = false;
        let show = false;

        // Calculate diff in days
        const diffTime = Math.abs(eventDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (eventDate >= today && diffDays <= 30) {
            show = true;
            if (diffDays <= item.urgentDays) {
                isUrgent = true;
            }
        }
        
        // If it has an end date, check if we are in the period
        if (item.endDate) {
             const endDate = new Date(item.endDate + "T23:59:59");
             if (today >= eventDate && today <= endDate) {
                 show = true;
                 isUrgent = true; // Urgent if currently happening
             }
        }

        if (show) {
            const div = document.createElement("div");
            div.className = `alert-box ${isUrgent ? 'urgent' : ''}`;
            
            const icon = isUrgent ? 'fa-triangle-exclamation' : 'fa-bell';
            
            div.innerHTML = `
                <i class="fa-solid ${icon}"></i>
                <div>
                    <strong>${item.title}</strong>
                    <p>${item.desc}</p>
                </div>
            `;
            container.appendChild(div);
            activeAlerts++;
        }
    });

    if (activeAlerts === 0) {
        container.innerHTML = `
            <div class="alert-box" style="border-left-color: var(--text-muted); background: rgba(148, 163, 184, 0.1);">
                <i class="fa-regular fa-calendar-check" style="color: var(--text-muted)"></i>
                <div>
                    <strong>Sem eventos próximos</strong>
                    <p>Fique tranquilo, nenhuma data limite se aproxima nos próximos 30 dias.</p>
                </div>
            </div>
        `;
    }
}
