# AppGlicemia — Documento de Premissas do Projeto

> Documento vivo. Deve ser atualizado sempre que uma decisão de escopo mudar.
> Última atualização: 2026-08-25

## 1. Visão geral

Aplicativo web para acompanhamento de glicemia de um paciente com **Diabetes Tipo 2**,
usado pelo próprio paciente e por familiares/cuidadores. Deve funcionar bem tanto em
computadores quanto em celulares, adaptando-se a qualquer tamanho de tela (design
responsivo).

## 2. Usuários e perfis

- **Paciente**: pessoa que mede a própria glicemia. Perfil relevante: **idosa ou com
  pouca familiaridade digital** → interface precisa priorizar simplicidade acima de
  recursos avançados (ver seção 7 — Interface e Acessibilidade).
- **Cuidador/familiar**: acompanha os dados do paciente. Acesso via **convite** a
  partir da conta do paciente (não é login compartilhado).
  - Modelo de conta: **uma conta principal (paciente) + convites de acesso para
    cuidadores**. Definir em fase de design se o cuidador terá conta própria vinculada
    ou apenas acesso de leitura via convite/link.

## 3. Objetivos do produto

1. Registrar e visualizar a glicemia no dia a dia.
2. Identificar padrões e tendências (ex.: glicemia alta recorrente após determinada
   refeição, ou baixa em determinado horário).
3. Gerar alertas de hipoglicemia (glicemia baixa) e hiperglicemia (glicemia alta).
4. Permitir gerar relatórios para compartilhar com o médico.

## 4. Escopo do MVP (primeira versão)

**MVP mínimo — foco só em glicemia:**
- Registro manual de medições de glicemia.
- Gráfico/histórico de medições.
- Alertas de hipo/hiperglicemia.

**Adiado para versões futuras** (fora do MVP, mas já mapeado como visão de produto):
- Registro de medicamentos/insulina.
- Registro de refeições/carboidratos.
- Registro de atividade física.
- Registro de peso corporal.
- Compartilhamento de dados com cuidadores (convites).
- Exportação de relatórios (PDF/CSV) e gráficos avançados para o médico.
- Notificações/lembretes (não é requisito agora; pode voltar a ser avaliado depois).

> Nota: os itens abaixo do MVP já foram discutidos e têm decisões registradas nas
> seções seguintes, para não precisar re-discutir quando chegar a hora de
> implementá-los.

## 5. Modelo de dados de glicemia

- **Unidade de medida**: mg/dL (padrão Brasil/EUA).
- **Entrada de dados**: digitação manual (sem integração com sensores CGM ou OCR de
  foto do glicosímetro, ao menos por ora).
- **Contexto da medição**: cada registro deve indicar o momento em relação às
  refeições/rotina — por exemplo: jejum, antes da refeição, depois da refeição, antes
  de dormir. Isso é importante porque o mesmo valor de glicemia pode ser normal ou
  preocupante dependendo do momento em que foi medido.
- **Faixas de alerta (hipo/hiperglicemia)**: o app deve trazer valores padrão de
  referência (configuráveis), permitindo que o próprio usuário (idealmente orientado
  pelo médico responsável) ajuste os limites depois. **Os valores padrão exibidos
  precisam ser revisados/validados com orientação médica real antes de uso
  contínuo** — este projeto não define esses números por conta própria.

### Dados adicionais previstos para versões futuras
- Medicamentos/insulina: nome, dose, horário.
- Refeições: descrição e, se possível, quantidade de carboidratos.
- Atividade física: tipo/duração.
- Peso corporal: valor e data.

## 6. Plataforma e requisitos técnicos

- **Responsivo**: deve funcionar bem em qualquer tamanho de tela (desktop, tablet,
  celular).
- **Conectividade**: assume-se que sempre haverá internet disponível — **não é
  necessário suporte offline** nesta fase (simplifica a arquitetura: sem
  sincronização local/PWA offline).
- **Notificações push**: não é requisito do MVP.
- **Stack técnica** (decidida em 2026-08-31):
  - Next.js 14+ (App Router) + TypeScript — frontend e backend no mesmo projeto.
  - Supabase (Postgres + Auth + Row Level Security) como banco de dados e autenticação.
  - Tailwind CSS + shadcn/ui para a interface (facilita fonte grande/alto contraste).
  - Recharts para o gráfico de histórico de glicemia.
  - React Hook Form + Zod para o formulário de registro de medições.
- **Hospedagem**: Vercel (frontend, free tier) + Supabase (banco/auth, free tier),
  adequado a um projeto pessoal/familiar.
- **Idioma**: apenas Português (Brasil). Sem necessidade de suporte multi-idioma.

## 7. Interface e acessibilidade

Paciente principal é idoso ou tem pouca familiaridade digital. Isso deve guiar todas
as decisões de UI:
- Fontes grandes e alto contraste.
- Poucos cliques/etapas para registrar uma medição (fluxo principal deve ser o mais
  curto possível).
- Evitar termos técnicos ou telas com muita informação simultânea.
- Recursos avançados (relatórios, gráficos de tendência, múltiplos campos) devem ficar
  em segundo plano na navegação, não competindo com a ação principal de "registrar
  glicemia agora".

## 8. Relatórios (fora do MVP, mas já definido)

Quando implementado, o relatório para uso médico deve conter:
- Visualização gráfica dentro do próprio app (linha do tempo, médias, variações).
- Exportação em PDF (para impressão/envio).
- Exportação em planilha CSV/Excel (dados brutos).

## 9. Privacidade e segurança de dados

Dados de glicemia/saúde são dados sensíveis segundo a LGPD (Lei Geral de Proteção de
Dados). Para este projeto, o nível de rigor definido é de **projeto pessoal/estudo**:
- Senhas armazenadas de forma segura (hash, nunca em texto puro).
- Dados criptografados em trânsito (HTTPS) e, na medida do possível, em repouso
  (no banco de dados).
- Nenhum compartilhamento de dados com terceiros/serviços de analytics/anúncios.
- Não é necessário aparato formal de compliance (DPO, política de privacidade
  formal, termos de consentimento jurídico) nesta fase — mas isso deve ser
  reavaliado se o app deixar de ser uso pessoal/familiar e passar a ter usuários
  fora desse círculo.

## 10. Fora de escopo (por ora)

- Integração com sensores de monitoramento contínuo (CGM) como FreeStyle Libre ou
  Dexcom.
- Reconhecimento de imagem (OCR) do visor do glicosímetro.
- Múltiplos pacientes independentes sem relação entre si (modelo tipo "produto para o
  público em geral").
- Acompanhamento por profissional de saúde com papel de acesso próprio.
- Suporte offline / PWA instalável.
- Notificações/lembretes programados.
- Suporte a outros idiomas.

## 11. Perguntas abertas / decisões pendentes

- Validar com um médico os valores padrão de faixas de alerta (hipo/hiperglicemia)
  antes de exibi-los como sugestão no app.
- Definir, quando o compartilhamento com cuidadores for implementado, se o cuidador
  terá conta própria ou acesso via link/convite sem conta.
