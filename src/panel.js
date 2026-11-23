// 독립 실행용 설정 패널: Patch에 올라가면 Patch 페이지가 recipe.json의 컨트롤을 그려 주지만,
// GitHub Pages처럼 단독 배포되면 호스트가 없으므로 이 패널이 같은 설정을 한국어로 제공한다.
import { block as recipeBlock } from '../recipe.json';

// 숫자 컨트롤 값 뒤에 붙이는 단위. recipe에 unit이 없는 것만 여기서 정한다.
const units = { crowd: '명' };

export function mountPanel({ onSet, onTrigger }) {
	// iframe으로 임베드된 경우(예: Patch 블록 페이지) 호스트가 컨트롤을 그리므로 패널을 만들지 않는다.
	if (window.parent !== window) return;
	const root = document.getElementById('panel');
	if (!root) return;

	const toggle = document.createElement('button');
	toggle.id = 'panel-toggle';
	toggle.type = 'button';
	toggle.textContent = '설정';
	const body = document.createElement('div');
	body.id = 'panel-body';
	root.append(toggle, body);

	for (const control of recipeBlock.controls) {
		const row = document.createElement('div');
		row.className = 'ctl';
		if (control.hint) row.title = control.hint;
		const head = document.createElement('div');
		head.className = 'ctl-head';
		const name = document.createElement('span');
		name.textContent = control.label;
		head.append(name);

		if (control.type === 'choice') {
			const opts = document.createElement('div');
			opts.className = 'ctl-opts';
			for (const option of control.options) {
				const b = document.createElement('button');
				b.type = 'button';
				if (option.image) {
					const img = document.createElement('img');
					img.src = option.image;
					img.alt = '';
					b.append(img);
				}
				const t = document.createElement('span');
				t.textContent = option.label;
				b.append(t);
				b.classList.toggle('on', option.value === control.default);
				b.addEventListener('click', () => {
					for (const other of opts.querySelectorAll('button')) other.classList.toggle('on', other === b);
					onSet(control.id, option.value);
				});
				opts.append(b);
			}
			row.append(head, opts);
		} else if (control.type === 'number') {
			const unit = units[control.id] ?? control.unit ?? '';
			const fmt = (n) => `${control.step < 1 ? n.toFixed(1) : n}${unit ? ' ' + unit : ''}`;
			const value = document.createElement('span');
			value.className = 'ctl-value';
			value.textContent = fmt(control.default);
			head.append(value);
			const slider = document.createElement('input');
			slider.type = 'range';
			slider.min = control.min;
			slider.max = control.max;
			slider.step = control.step;
			slider.value = control.default;
			slider.setAttribute('aria-label', control.label);
			slider.addEventListener('input', () => {
				const n = Number(slider.value);
				value.textContent = fmt(n);
				onSet(control.id, n);
			});
			row.append(head, slider);
		} else if (control.type === 'toggle') {
			const sw = document.createElement('input');
			sw.type = 'checkbox';
			sw.checked = Boolean(control.default);
			sw.setAttribute('aria-label', control.label);
			sw.addEventListener('change', () => onSet(control.id, sw.checked));
			head.append(sw);
			row.append(head);
		}
		body.append(row);
	}

	if (recipeBlock.triggers?.length) {
		const row = document.createElement('div');
		row.className = 'ctl ctl-triggers';
		for (const trigger of recipeBlock.triggers) {
			const b = document.createElement('button');
			b.type = 'button';
			b.textContent = trigger.label;
			if (trigger.hint) b.title = trigger.hint;
			b.addEventListener('click', () => onTrigger(trigger.id));
			row.append(b);
		}
		body.append(row);
	}

	const setOpen = (open) => {
		root.classList.toggle('open', open);
		toggle.setAttribute('aria-expanded', String(open));
	};
	toggle.addEventListener('click', () => setOpen(!root.classList.contains('open')));
	// 좁은 화면에서는 장면을 가리지 않도록 접어 둔다.
	setOpen(!matchMedia('(max-width: 720px)').matches);
}
