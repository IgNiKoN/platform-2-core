/**
 * Экран «Вход» при открытии платформы (P2-0013). Без React: файл входа маленький и скачивается всем, а модули — только положенные.
 * Вкладки: «Почта и пароль» (основной, один вход на все разделы Platform 2.0) и «Имя, код проекта и PIN» — прежняя форма
 * и прежний код входа Quality (кнопка data-shell-action="submitAuthGateConnect" → sync-*.js) без изменения логики. Ниже — «Посмотреть без входа (демо)».
 */
export interface LoginScreenOpts {
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  onDemo: () => void;
  /** Облако Quality включено (сборка «выпуск»): иначе вкладка PIN показывает прежнее «облачный вход отключён». */
  pinEnabled: boolean;
  pinDisabledMessage: string;
}

export const LOGIN_CSS = `
.p2-login{width:100%;max-width:380px;background:var(--card-bg);color:var(--text-main);border:1px solid var(--card-border);border-radius:24px;padding:22px 20px;box-shadow:0 20px 50px rgba(0,0,0,.25);display:flex;flex-direction:column;gap:14px;max-height:calc(100dvh - 32px);overflow-y:auto}
.p2-login h2{margin:0;text-align:center;font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:-.01em}
.p2-login-sub{margin:-8px 0 0;text-align:center;font-size:12px;color:var(--text-muted)}
.p2-login-tabs{display:flex;gap:4px;padding:4px;border:1px solid var(--card-border);border-radius:12px}
.p2-login-tab{flex:1 1 0;min-height:40px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;line-height:1.2;padding:6px 8px;border:0;border-radius:8px;background:transparent;color:var(--text-muted);cursor:pointer}
.p2-login-tab[aria-selected="true"]{background:var(--accent,var(--primary));color:#fff}
.p2-login form,.p2-login-pin{display:flex;flex-direction:column;gap:12px}
.p2-login [hidden]{display:none!important}
.p2-login label{display:flex;flex-direction:column;gap:4px;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted)}
.p2-login input{font-size:16px;min-height:44px;padding:9px 12px;border:1px solid var(--card-border);border-radius:10px;background:var(--card-bg);color:var(--text-main)}
.p2-login-btn{min-height:46px;font-size:13px;font-weight:800;text-transform:uppercase;border-radius:12px;border:0;background:var(--accent,var(--primary));color:#fff;cursor:pointer}
.p2-login-btn:disabled{opacity:.6;cursor:default}
.p2-login-error{font-size:13px;color:var(--color-red,#dc2626)}
.p2-login-note{font-size:12px;color:var(--text-muted);line-height:1.4}
.p2-login-off{font-size:13px;padding:12px;border-radius:10px;border:1px solid var(--card-border);color:var(--text-muted)}
.p2-login-demo{align-self:center;min-height:40px;font-size:12px;border:0;background:transparent;color:var(--text-muted);text-decoration:underline;cursor:pointer}
`;

function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, attrs: Record<string, string> = {}, text?: string): HTMLElementTagNameMap[K] {
  const e = doc.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}

function field(doc: Document, label: string, input: Record<string, string>): HTMLLabelElement {
  const l = el(doc, 'label', {}, label);
  l.appendChild(el(doc, 'input', input));
  return l;
}

/** Нарисовать экран входа в контейнер. Возвращает функцию очистки. */
export function renderLoginScreen(host: HTMLElement, opts: LoginScreenOpts): () => void {
  const doc = host.ownerDocument;
  host.replaceChildren();
  const card = el(doc, 'div', { class: 'p2-login', 'data-testid': 'p2-login', role: 'dialog', 'aria-label': 'Вход' });
  card.append(el(doc, 'h2', {}, 'Вход'), el(doc, 'p', { class: 'p2-login-sub' }, 'RBI Platform'));

  const tabs = el(doc, 'div', { class: 'p2-login-tabs', role: 'tablist' });
  const tEmail = el(doc, 'button', { type: 'button', role: 'tab', class: 'p2-login-tab', 'data-tab': 'email' }, 'Почта и пароль');
  const tPin = el(doc, 'button', { type: 'button', role: 'tab', class: 'p2-login-tab', 'data-tab': 'pin' }, 'Имя, код проекта и PIN');
  tabs.append(tEmail, tPin);

  // Почта и пароль
  const form = el(doc, 'form', { 'data-testid': 'p2-login-email', novalidate: '' });
  form.append(
    field(doc, 'Почта', { type: 'email', name: 'email', autocomplete: 'username', inputmode: 'email' }),
    field(doc, 'Пароль', { type: 'password', name: 'password', autocomplete: 'current-password' })
  );
  const err = el(doc, 'div', { class: 'p2-login-error', role: 'alert', hidden: '' });
  const submit = el(doc, 'button', { type: 'submit', class: 'p2-login-btn' }, 'Войти');
  form.append(err, submit);
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (submit.disabled) return;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    if (!email.trim() || !password) { err.textContent = 'Введите почту и пароль'; err.hidden = false; return; }
    submit.disabled = true; submit.textContent = 'Входим…'; err.hidden = true;
    void opts.signIn(email, password).then((res) => {
      submit.disabled = false; submit.textContent = 'Войти';
      if (!res.ok) { err.textContent = res.message; err.hidden = false; return; }
      form.reset();
    });
  });

  // Имя, код проекта и PIN — прежняя форма Quality (те же поля gate-sync-*; вход выполняет прежний код)
  const pin = el(doc, 'div', { class: 'p2-login-pin', 'data-testid': 'p2-login-pin', hidden: '' });
  pin.appendChild(el(doc, 'div', { class: 'p2-login-note' }, 'Для сотрудников, работающих в «Качестве» по старому входу.'));
  if (opts.pinEnabled) {
    pin.append(
      field(doc, 'Имя (Фамилия И.О.) *', { type: 'text', id: 'gate-sync-name', placeholder: 'Иванов И.И.' }),
      field(doc, 'Код компании *', { type: 'text', id: 'gate-sync-code', placeholder: 'Например: RBI-COMPANY' }),
      field(doc, 'ПИН-код (Опционально)', { type: 'password', id: 'gate-sync-pin', autocomplete: 'new-password', placeholder: '4 цифры', maxlength: '4', inputmode: 'numeric' })
    );
    // Прежняя кнопка: оболочка сама обрабатывает data-shell-action (ShellService.submitAuthGateConnect), как раньше.
    pin.appendChild(el(doc, 'button', { type: 'button', class: 'p2-login-btn', 'data-shell-action': 'submitAuthGateConnect', 'data-testid': 'p2-login-pin-go' }, 'Подключиться'));
  } else {
    pin.appendChild(el(doc, 'div', { class: 'p2-login-off', 'data-testid': 'p2-login-pin-off' }, opts.pinDisabledMessage || 'Облачный вход отключён'));
  }

  const demo = el(doc, 'button', { type: 'button', class: 'p2-login-demo', 'data-testid': 'p2-login-demo' }, 'Посмотреть без входа (демо)');
  demo.addEventListener('click', () => opts.onDemo());

  const select = (which: 'email' | 'pin'): void => {
    tEmail.setAttribute('aria-selected', String(which === 'email'));
    tPin.setAttribute('aria-selected', String(which === 'pin'));
    form.hidden = which !== 'email';
    pin.hidden = which !== 'pin';
  };
  tEmail.addEventListener('click', () => select('email'));
  tPin.addEventListener('click', () => select('pin'));
  select('email');

  card.append(tabs, form, pin, demo);
  host.appendChild(card);
  return () => host.replaceChildren();
}
