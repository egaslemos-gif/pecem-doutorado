const checklistData = [
    {
        id: "task-1",
        title: "Inscrição Google Forms",
        desc: "Obrigatório e-mail @gmail.com.",
        link: "https://forms.gle/Ep2ryPzkXLkrGUSL9",
        linkText: "Acessar Formulário",
        icon: "fa-brands fa-google",
        colorClass: "pink",
        status: "previsto"
    },
    {
        id: "task-2",
        title: "Digitalizar NUIT",
        desc: "Cópia digitalizada em PDF.",
        icon: "fa-solid fa-id-card",
        colorClass: "blue",
        status: "previsto"
    },
    {
        id: "task-3",
        title: "Histórico Escolar",
        desc: "Graduação. Legível em PDF.",
        icon: "fa-solid fa-file-lines",
        colorClass: "green",
        status: "previsto"
    },
    {
        id: "task-4",
        title: "Diploma de Graduação",
        desc: "Cópia frente e verso.",
        icon: "fa-solid fa-graduation-cap",
        colorClass: "orange",
        status: "previsto"
    },
    {
        id: "task-5",
        title: "Currículo Lattes",
        desc: "Exportar RTF e anexar certificados.",
        link: "https://lattes.cnpq.br/",
        linkText: "Acessar Plataforma Lattes",
        icon: "fa-solid fa-globe",
        colorClass: "cyan",
        status: "previsto"
    },
    {
        id: "task-6",
        title: "Projeto de Pesquisa",
        desc: "Máx 10 págs. Formato PDF A4.",
        icon: "fa-solid fa-lightbulb",
        colorClass: "pink",
        status: "previsto"
    },
    {
        id: "task-7",
        title: "Histórico do Mestrado",
        desc: "Cópia digitalizada em PDF.",
        icon: "fa-solid fa-book",
        colorClass: "blue",
        status: "previsto"
    },
    {
        id: "task-8",
        title: "Diploma de Mestre",
        desc: "Frente e verso em PDF.",
        icon: "fa-solid fa-award",
        colorClass: "green",
        status: "previsto"
    }
];

const cronograma = [
    { id: "evt-1", title: "Inscrições Abertas", desc: "Via Google Forms", start: "2026-09-28T00:00:00", end: "2026-11-01T23:59:59" },
    { id: "evt-2", title: "Divulgação Homologação", desc: "Resultado", start: "2026-11-13T16:00:00", end: "2026-11-15T23:59:59" },
    { id: "evt-3", title: "Google Classroom", desc: "Inserção", start: "2026-11-16T00:00:00", end: "2026-11-20T23:59:59" },
    { id: "evt-4", title: "Classroom (Limite)", desc: "Acesso final", start: "2026-11-21T00:00:00", end: "2026-11-21T19:00:00" },
    { id: "evt-5", title: "1ª Etapa (Prova)", desc: "Redação Online", start: "2027-01-19T08:30:00", end: "2027-01-19T12:30:00" },
    { id: "evt-6", title: "Resultado 1ª Etapa", desc: "Site PECEM", start: "2027-02-12T16:00:00", end: "2027-02-14T23:59:59" },
    { id: "evt-7", title: "2ª Etapa", desc: "Arguição (Meet)", start: "2027-02-15T00:00:00", end: "2027-02-26T23:59:59" },
    { id: "evt-8", title: "Resultado Final", desc: "Site PECEM", start: "2027-03-05T00:00:00", end: "2027-03-07T23:59:59" },
    { id: "evt-9", title: "Matrícula", desc: "Solicitação", start: "2027-03-08T00:00:00", end: "2027-03-12T23:59:59" },
    { id: "evt-10", title: "Upload Docs", desc: "Confirmação", start: "2027-03-22T00:00:00", end: "2027-03-23T23:59:59" }
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
    
    // Ensure structure is up to date (merge logic)
    tasks.forEach((task, index) => {
        if(checklistData[index]) {
            task.desc = checklistData[index].desc;
            task.icon = checklistData[index].icon;
            task.colorClass = checklistData[index].colorClass;
            task.link = checklistData[index].link;
            task.linkText = checklistData[index].linkText;
        }
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
        
        // Match CSS variables defined in style.css
        const bgColors = {
            'pink': 'var(--c-pink-bg)',
            'blue': 'var(--c-blue-bg)',
            'green': 'var(--c-green-bg)',
            'orange': 'var(--c-orange-bg)',
            'cyan': 'var(--c-cyan-bg)'
        };
        const txtColors = {
            'pink': 'var(--c-pink-txt)',
            'blue': 'var(--c-blue-txt)',
            'green': 'var(--c-green-txt)',
            'orange': 'var(--c-orange-txt)',
            'cyan': 'var(--c-cyan-txt)'
        };

        const linkHtml = task.link ? `<a href='${task.link}' target='_blank' class='task-link'><i class='fa-solid fa-link'></i> ${task.linkText}</a>` : '';

        // Emoji for select
        let iconSel = '⚪';
        if(task.status === 'processo') iconSel = '🟡';
        if(task.status === 'concluido') iconSel = '✅';

        div.innerHTML = `
            <div class="task-icon" style="background-color: ${bgColors[task.colorClass]}; color: ${txtColors[task.colorClass]};">
                <i class="${task.icon}"></i>
            </div>
            <div class="task-info">
                <h4>${task.title}</h4>
                <p>${task.desc}</p>
                ${linkHtml}
            </div>
            <select class="task-status-select" onchange="changeStatus('${task.id}', this.value)">
                <option value="previsto" ${task.status === 'previsto' ? 'selected' : ''}>⚪</option>
                <option value="processo" ${task.status === 'processo' ? 'selected' : ''}>🟡</option>
                <option value="concluido" ${task.status === 'concluido' ? 'selected' : ''}>✅</option>
            </select>
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
        
        // Re-render completely for simplicity to update the select emoji visually if needed
        initChecklist(); 
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
        const div = document.createElement("div");
        div.className = `event-row`;
        div.id = event.id;
        
        div.innerHTML = `
            <div class="event-icon" id="icon-${event.id}">
                <i class="fa-solid fa-play"></i>
            </div>
            <div class="event-details">
                <h4>${event.title}</h4>
                <p>${event.desc}</p>
            </div>
            <div class="event-time" id="countdown-${event.id}">
                --:--
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
        const iconEl = document.getElementById(`icon-${event.id}`);
        if(!eventEl || !countdownEl) return;

        // Reset classes
        eventEl.classList.remove('future', 'active', 'urgent', 'past');
        
        if (now > end) {
            eventEl.classList.add('past');
            countdownEl.innerHTML = `Encerrado`;
            iconEl.innerHTML = `<i class="fa-solid fa-check"></i>`;
            return;
        }
        
        if (now >= start && now <= end) {
            const timeRemaining = end - now;
            const t = getTimeObjects(timeRemaining);
            
            if (t.d <= 3) {
                eventEl.classList.add('urgent');
                countdownEl.innerHTML = formatTime(t);
                iconEl.innerHTML = `<i class="fa-solid fa-fire"></i>`;
            } else {
                eventEl.classList.add('active');
                countdownEl.innerHTML = formatTime(t);
                iconEl.innerHTML = `<i class="fa-solid fa-pause"></i>`;
            }
            return;
        }
        
        if (now < start) {
            const timeUntilStart = start - now;
            const t = getTimeObjects(timeUntilStart);
            eventEl.classList.add('future');
            countdownEl.innerHTML = formatTime(t);
            iconEl.innerHTML = `<i class="fa-solid fa-clock"></i>`;
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
        return `${t.d}d ${t.h.toString().padStart(2, '0')}:${t.m.toString().padStart(2, '0')}`;
    }
    return `${t.h.toString().padStart(2, '0')}:${t.m.toString().padStart(2, '0')}:${t.s.toString().padStart(2, '0')}`;
}
