const checklistData = [
    {
        id: "task-1",
        title: "Preencher Formulário de Inscrição (Google Forms)",
        desc: "Obrigatório o uso de e-mail @gmail.com. <br><a href='https://forms.gle/Ep2ryPzkXLkrGUSL9' target='_blank' class='task-link'><i class='fa-solid fa-arrow-up-right-from-square'></i> Acessar Formulário</a>",
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
        desc: "Exportar cópia RTF. Anexar todos os certificados em arquivo único (PDF). <br><a href='https://lattes.cnpq.br/' target='_blank' class='task-link'><i class='fa-solid fa-arrow-up-right-from-square'></i> Acessar Plataforma Lattes</a>",
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

const cronograma = [
    { id: "evt-1", title: "Inscrições Abertas (Forms)", start: "2026-09-28T00:00:00", end: "2026-11-01T23:59:59" },
    { id: "evt-2", title: "Divulgação da Homologação", start: "2026-11-13T16:00:00", end: "2026-11-15T23:59:59" },
    { id: "evt-3", title: "Inserção no Google Classroom", start: "2026-11-16T00:00:00", end: "2026-11-20T23:59:59" },
    { id: "evt-4", title: "Limite de Entrada no Classroom", start: "2026-11-21T00:00:00", end: "2026-11-21T19:00:00" },
    { id: "evt-5", title: "1ª Etapa (Prova de Redação)", start: "2027-01-19T08:30:00", end: "2027-01-19T12:30:00" },
    { id: "evt-6", title: "Resultado 1ª Etapa", start: "2027-02-12T16:00:00", end: "2027-02-14T23:59:59" },
    { id: "evt-7", title: "2ª Etapa (Análises e Arguição)", start: "2027-02-15T00:00:00", end: "2027-02-26T23:59:59" },
    { id: "evt-8", title: "Resultado Final", start: "2027-03-05T00:00:00", end: "2027-03-07T23:59:59" },
    { id: "evt-9", title: "Solicitação de Matrícula", start: "2027-03-08T00:00:00", end: "2027-03-12T23:59:59" },
    { id: "evt-10", title: "Confirmação (Upload Docs)", start: "2027-03-22T00:00:00", end: "2027-03-23T23:59:59" }
];

document.addEventListener("DOMContentLoaded", () => {
    initChecklist();
    initCronogramaUI();
    updateCountdowns(); // Initial run
    setInterval(updateCountdowns, 1000); // Live update every second
});

function initChecklist() {
    const savedData = JSON.parse(localStorage.getItem("pecem_doutorado_checklist"));
    const tasks = savedData || checklistData;
    
    // In case we added new links/descriptions to the base data, merge it to avoid overriding with old localstorage.
    tasks.forEach((task, index) => {
        task.desc = checklistData[index].desc;
    });
    
    renderTasks(tasks);
    updateProgress(tasks);

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterTasks(e.target.dataset.filter);
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
        
        const taskEl = document.querySelector(`.task-item[data-id="${id}"]`);
        if (taskEl) taskEl.dataset.status = newStatus;
        
        updateProgress(tasks);
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
        item.style.display = (filter === 'all' || item.dataset.status === filter) ? 'flex' : 'none';
    });
}

// ---- Inteligência do Cronograma Ao Vivo ----
function initCronogramaUI() {
    const container = document.getElementById("events-container");
    container.innerHTML = "";

    cronograma.forEach(event => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        
        const formatOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        
        const div = document.createElement("div");
        div.className = `event-box`;
        div.id = event.id; // Identifier for live updates
        
        div.innerHTML = `
            <div class="event-header">
                <div class="event-title">${event.title}</div>
            </div>
            <div class="event-dates">
                <span><i class="fa-solid fa-play"></i> ${start.toLocaleDateString('pt-BR', formatOptions)}</span>
                <span><i class="fa-solid fa-flag-checkered"></i> ${end.toLocaleDateString('pt-BR', formatOptions)}</span>
            </div>
            <div class="event-countdown" id="countdown-${event.id}">
                <!-- Injected via JS -->
            </div>
            <div class="event-progress">
                <div class="event-progress-fill" id="progress-${event.id}"></div>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateCountdowns() {
    const now = new Date();

    cronograma.forEach(event => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        
        const eventEl = document.getElementById(event.id);
        const countdownEl = document.getElementById(`countdown-${event.id}`);
        const progressEl = document.getElementById(`progress-${event.id}`);
        if(!eventEl || !countdownEl || !progressEl) return;

        // Reset classes
        eventEl.classList.remove('status-future', 'status-active', 'status-urgent', 'status-past');
        
        const totalDuration = end - start;
        
        if (now > end) {
            eventEl.classList.add('status-past');
            countdownEl.innerHTML = `✅ Prazo Encerrado`;
            progressEl.style.width = '100%';
            return;
        }
        
        if (now >= start && now <= end) {
            const timeRemaining = end - now;
            const elapsed = now - start;
            let percent = (elapsed / totalDuration) * 100;
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            
            progressEl.style.width = `${percent}%`;
            
            const t = getTimeObjects(timeRemaining);
            
            if (t.d <= 3) {
                eventEl.classList.add('status-urgent');
                countdownEl.innerHTML = `🔥 Termina em: ${formatTime(t)}`;
            } else {
                eventEl.classList.add('status-active');
                countdownEl.innerHTML = `🟢 Restam: ${formatTime(t)}`;
            }
            return;
        }
        
        if (now < start) {
            progressEl.style.width = '0%';
            const timeUntilStart = start - now;
            const t = getTimeObjects(timeUntilStart);
            
            if (t.d <= 7) {
                 eventEl.classList.add('status-future');
                 countdownEl.innerHTML = `🔜 Inicia em: ${formatTime(t)}`;
            } else {
                 eventEl.classList.add('status-future');
                 countdownEl.innerHTML = `⏳ Aguardando (${t.d} dias)`;
            }
        }
    });
}

function getTimeObjects(ms) {
    const d = Math.floor(ms / (1000 * 60 * 60 * 24));
    const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return { d, h, m, s };
}

function formatTime(t) {
    if (t.d > 0) {
        return `${t.d}d ${t.h.toString().padStart(2, '0')}h ${t.m.toString().padStart(2, '0')}m ${t.s.toString().padStart(2, '0')}s`;
    }
    return `${t.h.toString().padStart(2, '0')}h ${t.m.toString().padStart(2, '0')}m ${t.s.toString().padStart(2, '0')}s`;
}
