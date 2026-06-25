let ids = 11;

function hideAll() {
    for (let i = 0; i < ids; i++) {
        const section = document.getElementById("A" + i);
        if (section) section.hidden = true;
    }
}

function showSection(id) {
    hideAll();
    const section = document.getElementById(id);
    if (section) section.hidden = false;
    if (id === "A9") initEasyChefPrototype();
}

function A0(){ showSection("A0"); }
function A1(){ showSection("A1"); }
function A2(){ showSection("A2"); }
function A3(){ showSection("A3"); }
function A4(){ showSection("A4"); }
function A5(){ showSection("A5"); }
function A6(){ showSection("A6"); }
function A7(){ showSection("A7"); }
function A8(){ showSection("A8"); }
function A9(){ showSection("A9"); }
function A10(){ showSection("A10"); }

function initEasyChefPrototype() {
    const phone = document.getElementById("easychefProto");
    if (!phone || phone.dataset.bound === "true") return;

    const drawer = phone.querySelector("#ecDrawer");
    const backdrop = phone.querySelector("#ecBackdrop");
    const hamburger = phone.querySelector("#ecHamburgerBtn");
    const drawerClose = phone.querySelector("#ecDrawerClose");
    const backButton = phone.querySelector("#ecBackBtn");
    const bell = phone.querySelector("#ecBellBtn");
    const badge = phone.querySelector("#ecNotificationBadge");
    const markRead = phone.querySelector("#ecMarkRead");
    const fab = phone.querySelector("#ecFab");
    const title = phone.querySelector("#ecScreenTitle");
    const content = phone.querySelector("#ecContent");
    const allViews = [...phone.querySelectorAll(".ec-view")];
    const bottomButtons = [...phone.querySelectorAll(".ec-bottom-item")];
    const drawerButtons = [...phone.querySelectorAll(".ec-drawer-item")];
    const rootViews = new Set(["feed", "grupos", "receitas", "perfil"]);
    let currentView = "feed";
    let history = ["feed"];
    let currentRecipe = "Frango grelhado com legumes";
    let currentRecipeImage = "img/easychef/frango-grelhado.jpg";
    let cookStep = 0;
    let toastTimer;

    const recipeCatalog = {
        "Frango grelhado com legumes": {
            image: "img/easychef/frango-grelhado.jpg", time: "35 minutos",
            ingredients: ["2 filés de frango", "Arroz cozido", "Legumes variados", "Alho, limão e páprica"],
            instructions: ["Tempere o frango com alho, limão e páprica.", "Grelhe os filés até dourarem dos dois lados.", "Aqueça o arroz e salteie os legumes antes de servir."]
        },
        "Frango cremoso": {
            image: "img/easychef/frango-cremoso.jpg", time: "40 minutos",
            ingredients: ["500 g de frango", "1 cebola", "Molho de tomate", "Creme de leite"],
            instructions: ["Doure o frango com a cebola.", "Acrescente o molho e cozinhe até o frango ficar macio.", "Finalize com creme de leite em fogo baixo."]
        },
        "Peixe grelhado com salada": {
            image: "img/easychef/peixe-grelhado.jpg", time: "30 minutos",
            ingredients: ["2 filés de peixe", "Folhas e tomate", "Limão", "Sal e ervas"],
            instructions: ["Tempere o peixe com limão, sal e ervas.", "Grelhe por alguns minutos de cada lado.", "Sirva com a salada temperada na hora."]
        },
        "Prato brasileiro completo": {
            image: "img/easychef/prato-brasileiro.jpg", time: "45 minutos",
            ingredients: ["Arroz", "Feijão", "1 ovo", "Farofa ou acompanhamento"],
            instructions: ["Prepare ou aqueça o arroz e o feijão.", "Frite ou cozinhe o ovo conforme sua preferência.", "Monte o prato e finalize com o acompanhamento."]
        },
        "Refeição saudável com arroz": {
            image: "img/easychef/refeicao-saudavel.jpg", time: "50 minutos",
            ingredients: ["Arroz", "Proteína grelhada", "Brócolis e tomate", "Molho leve"],
            instructions: ["Cozinhe o arroz e os vegetais.", "Grelhe a proteína até atingir o ponto desejado.", "Monte o prato e sirva com o molho à parte."]
        }
    };

    const showToast = (message) => {
        const toast = phone.querySelector("#ecToast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
    };

    const openDrawer = () => {
        drawer.classList.add("open");
        backdrop.classList.add("show");
        drawer.setAttribute("aria-hidden", "false");
        hamburger.setAttribute("aria-expanded", "true");
        drawerClose.focus();
    };

    const closeDrawer = (restoreFocus = false) => {
        drawer.classList.remove("open");
        backdrop.classList.remove("show");
        drawer.setAttribute("aria-hidden", "true");
        hamburger.setAttribute("aria-expanded", "false");
        if (restoreFocus) hamburger.focus();
    };

    const updateNavigationState = () => {
        bottomButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.ecView === currentView));
        drawerButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.ecView === currentView));
        backButton.hidden = rootViews.has(currentView) && history.length <= 1;
        fab.classList.toggle("hidden", ["actions", "nova", "cozinhar", "buscar"].includes(currentView));
    };

    const setView = (viewName, options = {}) => {
        const target = phone.querySelector(`#ecView-${viewName}`);
        if (!target) return;
        if (viewName !== currentView && options.push !== false) history.push(viewName);
        currentView = viewName;
        allViews.forEach((view) => view.classList.toggle("active", view === target));
        title.textContent = target.dataset.ecTitle || "EasyChef";
        updateNavigationState();
        content.scrollTop = 0;
        closeDrawer();
        if (viewName === "cozinhar") updateCookStep(0);
        if (viewName === "buscar") filterRecipes();
    };

    const goBack = () => {
        if (history.length > 1) history.pop();
        const previous = history[history.length - 1] || "feed";
        setView(previous, { push: false });
    };

    const renderRecipe = () => {
        const data = recipeCatalog[currentRecipe] || recipeCatalog["Frango grelhado com legumes"];
        currentRecipeImage = data.image;
        const recipeTitle = phone.querySelector("#ecRecipeTitle");
        const cookImage = phone.querySelector("#ecCookImage");
        const ingredientList = phone.querySelector("#ecIngredientList");
        const instructionList = phone.querySelector("#ecInstructionList");
        const cookTime = phone.querySelector("#ecCookTime");
        if (recipeTitle) recipeTitle.textContent = currentRecipe;
        if (cookImage) { cookImage.src = data.image; cookImage.alt = `${currentRecipe} servido em um prato`; }
        if (ingredientList) {
            ingredientList.innerHTML = data.ingredients.map((item) => `<label class="ec-check-row"><input type="checkbox"> ${item}</label>`).join("");
        }
        if (instructionList) {
            instructionList.innerHTML = data.instructions.map((item) => `<li>${item}</li>`).join("");
        }
        if (cookTime) cookTime.textContent = data.time;
    };

    const selectRecipe = (element) => {
        const recipe = element.dataset.recipe;
        if (recipe) {
            currentRecipe = recipe;
            currentRecipeImage = element.dataset.image || recipeCatalog[recipe]?.image || currentRecipeImage;
            renderRecipe();
        }
    };

    const updateCookStep = (step) => {
        cookStep = Math.max(0, Math.min(2, step));
        phone.querySelectorAll(".ec-step").forEach((button) => {
            const active = Number(button.dataset.step) === cookStep;
            button.classList.toggle("active", active);
            if (active) button.setAttribute("aria-current", "step");
            else button.removeAttribute("aria-current");
        });
        phone.querySelectorAll(".ec-cook-panel").forEach((panel) => panel.classList.toggle("active", Number(panel.dataset.stepPanel) === cookStep));
        const prev = phone.querySelector("#ecPrevStep");
        const next = phone.querySelector("#ecNextStep");
        prev.disabled = cookStep === 0;
        next.textContent = cookStep === 2 ? "Concluir e registrar" : "Próxima etapa";
    };

    const filterRecipes = () => {
        const query = (phone.querySelector("#ecSearchInput")?.value || "").trim().toLowerCase();
        const activeFilters = [...phone.querySelectorAll(".ec-chip.active")].map((chip) => chip.dataset.filter);
        let visible = 0;
        phone.querySelectorAll("#ecRecipeResults .ec-recipe-card").forEach((card) => {
            const matchesText = !query || card.dataset.name.toLowerCase().includes(query);
            const tags = (card.dataset.tags || "").split(" ");
            const matchesFilters = activeFilters.every((filter) => tags.includes(filter));
            const show = matchesText && matchesFilters;
            card.hidden = !show;
            if (show) visible++;
        });
        const summary = phone.querySelector("#ecResultsSummary");
        if (summary) summary.textContent = `${visible} ${visible === 1 ? "receita encontrada" : "receitas encontradas"}`;
    };

    hamburger.addEventListener("click", () => drawer.classList.contains("open") ? closeDrawer(true) : openDrawer());
    drawerClose.addEventListener("click", () => closeDrawer(true));
    backdrop.addEventListener("click", () => closeDrawer(true));
    backButton.addEventListener("click", goBack);
    bell.addEventListener("click", () => setView("notificacoes"));
    fab.addEventListener("click", () => setView("actions"));

    markRead?.addEventListener("click", () => {
        phone.querySelectorAll(".ec-notification-item").forEach((item) => item.classList.remove("unread"));
        badge.hidden = true;
        showToast("Notificações marcadas como lidas.");
    });

    phone.addEventListener("click", (event) => {
        const viewControl = event.target.closest("[data-ec-view]");
        if (viewControl && phone.contains(viewControl)) {
            selectRecipe(viewControl);
            const mode = viewControl.dataset.searchMode;
            if (mode) {
                const heading = phone.querySelector("#ecSearchHeading");
                if (heading) heading.textContent = mode === "amigos" ? "Receitas dos amigos" : "Receitas do EasyChef";
            }
            const targetView = viewControl.dataset.ecView;
            if (viewControl.classList.contains("ec-bottom-item")) {
                history = [targetView];
                setView(targetView, { push: false });
            } else {
                setView(targetView);
            }
        }

        const actionControl = event.target.closest("[data-ec-action]");
        if (!actionControl || !phone.contains(actionControl)) return;
        const action = actionControl.dataset.ecAction;
        if (action === "like") {
            actionControl.classList.toggle("active");
            const counter = actionControl.querySelector("span");
            if (counter) counter.textContent = Number(counter.textContent) + (actionControl.classList.contains("active") ? 1 : -1);
            showToast(actionControl.classList.contains("active") ? "Publicação curtida." : "Curtida removida.");
        } else if (action === "save") {
            actionControl.classList.toggle("active");
            actionControl.textContent = actionControl.classList.contains("active") ? "Salvo" : "Salvar";
            showToast(actionControl.classList.contains("active") ? "Receita salva para depois." : "Receita removida dos salvos.");
        } else if (action === "comment") {
            showToast("Campo de comentário aberto.");
        } else if (action === "new-group") {
            showToast("Criação de grupo disponível na próxima etapa do protótipo.");
        }
    });


    phone.querySelectorAll(".ec-chip").forEach((chip) => chip.addEventListener("click", () => {
        chip.classList.toggle("active");
        chip.setAttribute("aria-pressed", chip.classList.contains("active") ? "true" : "false");
        filterRecipes();
    }));
    phone.querySelector("#ecSearchInput")?.addEventListener("input", filterRecipes);

    phone.querySelectorAll(".ec-step").forEach((stepButton) => stepButton.addEventListener("click", () => updateCookStep(Number(stepButton.dataset.step))));
    phone.querySelector("#ecPrevStep")?.addEventListener("click", () => updateCookStep(cookStep - 1));
    phone.querySelector("#ecNextStep")?.addEventListener("click", () => {
        if (cookStep < 2) updateCookStep(cookStep + 1);
        else {
            const nameInput = phone.querySelector("#ecRecipeName");
            if (nameInput) nameInput.value = currentRecipe;
            setView("nova");
        }
    });

    phone.querySelector("#ecUploadButton")?.addEventListener("click", (event) => {
        event.currentTarget.classList.add("selected");
        phone.querySelector("#ecUploadText").textContent = "Foto adicionada";
        const preview = phone.querySelector("#ecUploadPreview");
        if (preview) {
            preview.src = currentRecipeImage || "img/easychef/prato-brasileiro.jpg";
            preview.hidden = false;
        }
        showToast("Foto adicionada ao registro.");
    });

    phone.querySelector("#ecPostForm")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const name = form.elements.recipeName.value.trim();
        const description = form.elements.description.value.trim();
        const error = phone.querySelector("#ecFormError");
        if (!name || !description) {
            error.hidden = false;
            error.textContent = "Preencha o nome do prato e conte como ele ficou antes de publicar.";
            (!name ? form.elements.recipeName : form.elements.description).focus();
            return;
        }
        error.hidden = true;
        const feed = phone.querySelector("#ecFeedList");
        const article = document.createElement("article");
        article.className = "ec-post-card";
        const safeName = name.replace(/[<>]/g, "");
        const safeDescription = description.replace(/[<>]/g, "");
        article.innerHTML = `<div class="ec-post-header"><img class="ec-avatar" src="img/easychef/avatar-chef.jpg" alt="Sua foto de perfil"><div class="ec-post-main"><h4>Você preparou ${safeName}</h4><small>Agora · Receita registrada</small></div></div><img class="ec-post-photo" src="${currentRecipeImage}" alt="${safeName} servido em um prato"><p>“${safeDescription}”</p><div class="ec-post-actions"><button type="button" data-ec-action="like">Curtir <span>0</span></button><button type="button" data-ec-action="comment">Comentar <span>0</span></button><button type="button" data-ec-view="post">Ver detalhes</button><button type="button" data-ec-action="save">Salvar</button></div>`;
        feed.prepend(article);
        form.reset();
        const upload = phone.querySelector("#ecUploadButton");
        upload.classList.remove("selected");
        phone.querySelector("#ecUploadText").textContent = "Adicionar foto";
        const preview = phone.querySelector("#ecUploadPreview");
        if (preview) preview.hidden = true;
        history = ["feed"];
        setView("feed", { push: false });
        showToast("Prato publicado com sucesso e desafio atualizado para 3 de 7.");
    });

    document.addEventListener("keydown", (event) => {
        if (!phone.isConnected) return;
        if (event.key === "Escape" && drawer.classList.contains("open")) closeDrawer(true);
    });

    renderRecipe();
    updateCookStep(0);
    filterRecipes();
    updateNavigationState();
    phone.dataset.bound = "true";
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("easychefProto")) initEasyChefPrototype();
});
