# EasyChef — alterações realizadas

A versão revisada corrige os problemas apontados na Avaliação Heurística e no Percurso Cognitivo.

## Principais mudanças

- O sino abre uma tela de notificações, exibe quantidade pendente e permite marcar itens como lidos.
- As publicações possuem ações explícitas de curtir, comentar, abrir detalhes e salvar.
- O desafio apresenta meta, quantidade atual, percentual e barra de progresso.
- O botão flutuante passou a ter o rótulo “Nova ação”.
- O menu lateral tem botão de fechar, fechamento pelo fundo e destaque da opção ativa.
- As opções da tela “Nova ação” receberam nomes e descrições mais claros.
- Os grupos apresentam objetivo, progresso, participantes e prazo.
- Foi criada uma área de ajuda e documentação.
- A busca possui filtros combináveis, contagem de resultados e campo de pesquisa funcional.
- O preparo foi dividido em etapas reais, com controles de avanço e retorno.
- O registro do prato usa vocabulário consistente e valida os campos obrigatórios.
- A publicação fornece feedback explícito e insere o novo item no feed.
- Foi adicionado botão de voltar nas telas internas e feedback por mensagens temporárias.

## Arquivos principais

- `docs/index.html`: portfólio com o protótipo revisado.
- `docs/prototipo.html`: versão independente do protótipo.
- `docs/style.css`: estilos do portfólio e do protótipo.
- `docs/script.js`: navegação e funcionalidades.

As fontes locais foram substituídas por fontes do sistema para reduzir dependências.

## Atualização com imagens reais

- As dez fotografias enviadas foram otimizadas e organizadas em `docs/img/easychef`.
- O feed passou a exibir avatares e fotos dos pratos.
- O desafio e os grupos receberam imagens contextuais.
- As listas de receitas agora usam miniaturas.
- A tela de preparo atualiza imagem, ingredientes, instruções e tempo conforme a receita selecionada.
- A simulação de publicação adiciona a imagem selecionada ao novo card do feed.
- Os créditos e nomes originais estão em `CREDITOS_IMAGENS.md`.

## Seção de Avaliação da Interação

- Adicionada a atividade A10 no menu lateral.
- Incluída a Avaliação Heurística consolidada com resumo quantitativo, cinco problemas representativos, gravidade, redesign e correções aplicadas.
- Adicionado link local para o relatório completo em PDF.
- Criada estrutura inicial para os resultados de First Click dos quatro integrantes, sem inventar dados ainda não fornecidos.

## Inclusão de evidências visuais na Avaliação Heurística

- As quatro capturas da versão anterior do protótipo foram renomeadas e movidas para `docs/img/avaliacao`.
- A seção A10 passou a relacionar cada captura ao problema heurístico correspondente.
- Foi incluído um novo problema representativo sobre a hierarquia visual da tela de detalhes do post.
- O CSS foi ajustado para apresentar as imagens com alinhamento, legenda e responsividade.

## Resultados do First Click e menu lateral

- Os oito arquivos de resultado do Useberry foram renomeados e organizados em `img/first-click`.
- A área provisória de First Click da seção A10 foi substituída por quatro tarefas com cenário, mapa de cliques, distribuição de tempo e interpretação.
- O menu lateral foi centralizado e os botões deixaram de aumentar de largura ao passar o mouse.
- Os títulos das atividades agora aparecem como caixas flutuantes à direita do botão, sem invadir ou recortar a barra lateral.
- O menu permanece vertical em notebooks e passa para o formato horizontal apenas em telas com até 760 px.

