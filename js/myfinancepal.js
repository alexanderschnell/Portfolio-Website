// myfinancepal.exe: a working mini version of MyFinancePal's payoff planner
// (github.com/alexanderschnell/personal-finance-tracker). It compares the
// Avalanche (highest rate first) and Snowball (smallest balance first)
// strategies for a set of made-up sample debts and a monthly budget.
document.addEventListener('DOMContentLoaded', () => {
    const budgetInput = document.getElementById('mfp-budget');
    if (!budgetInput) return;

    // Sample data only: these are not anyone's real debts.
    const DEBTS = [
        { name: 'Visa card', balance: 7400, apr: 21.99, min: 185 },
        { name: 'Line of credit', balance: 1900, apr: 9.95, min: 50 },
        { name: 'Student loan', balance: 9800, apr: 6.5, min: 120 },
    ];

    const STRATEGIES = [
        { id: 'avalanche', name: 'Avalanche', rule: 'Highest interest rate first', order: (a, b) => b.apr - a.apr },
        { id: 'snowball', name: 'Snowball', rule: 'Smallest balance first', order: (a, b) => a.balance - b.balance },
    ];

    const money = (n) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
    const tbody = document.getElementById('mfp-debts');
    const budgetOut = document.getElementById('mfp-budget-out');
    const results = document.getElementById('mfp-results');
    const tip = document.getElementById('mfp-tip');
    const status = document.getElementById('mfp-status');

    DEBTS.forEach((d) => {
        const tr = document.createElement('tr');
        [d.name, money(d.balance), `${d.apr.toFixed(2)}%`, money(d.min)].forEach((text, i) => {
            const cell = document.createElement(i === 0 ? 'th' : 'td');
            if (i === 0) cell.scope = 'row';
            cell.textContent = text;
            tr.append(cell);
        });
        tbody.append(tr);
    });

    // Month-by-month simulation: interest accrues, every debt gets its minimum,
    // and everything left over (including minimums freed up by debts already
    // paid off) goes to the strategy's current target.
    function simulate(strategy, budget) {
        const debts = DEBTS.map((d) => ({ ...d })).sort(strategy.order);
        const paidOff = [];
        let interest = 0;
        let month = 0;
        while (debts.some((d) => d.balance > 0.005) && month < 600) {
            month++;
            debts.forEach((d) => {
                if (d.balance <= 0) return;
                const charge = d.balance * (d.apr / 100 / 12);
                d.balance += charge;
                interest += charge;
            });
            let left = budget;
            debts.forEach((d) => {
                const pay = Math.min(d.min, d.balance, left);
                d.balance -= pay;
                left -= pay;
            });
            for (const d of debts) {
                if (left <= 0) break;
                const pay = Math.min(d.balance, left);
                d.balance -= pay;
                left -= pay;
            }
            debts.forEach((d) => {
                if (d.balance <= 0.005 && !paidOff.some((p) => p.name === d.name)) {
                    d.balance = 0;
                    paidOff.push({ name: d.name, month });
                }
            });
        }
        return { months: month, interest, paidOff };
    }

    function duration(months) {
        const y = Math.floor(months / 12);
        const m = months % 12;
        return [y && `${y} yr${y === 1 ? '' : 's'}`, m && `${m} mo${m === 1 ? '' : 's'}`].filter(Boolean).join(' ') || '0 mos';
    }

    function finishDate(months) {
        const d = new Date();
        d.setMonth(d.getMonth() + months);
        return d.toLocaleDateString('en-CA', { month: 'short', year: 'numeric' });
    }

    function render() {
        const budget = Number(budgetInput.value);
        budgetOut.textContent = money(budget);
        const minimums = DEBTS.reduce((s, d) => s + d.min, 0);
        if (budget < minimums) {
            results.textContent = `The budget must cover the minimum payments (${money(minimums)}).`;
            tip.textContent = '';
            return;
        }

        const runs = STRATEGIES.map((s) => ({ ...s, ...simulate(s, budget) }));
        const best = runs.reduce((a, b) => (b.interest < a.interest ? b : a));
        const worst = runs.find((r) => r !== best);
        const savings = worst.interest - best.interest;
        const longest = Math.max(...runs.map((r) => r.months));

        results.replaceChildren(...runs.map((r) => {
            const card = document.createElement('div');
            card.className = 'strategy-card' + (r === best && savings >= 1 ? ' best' : '');

            const head = document.createElement('div');
            head.className = 'strategy-head';
            const name = document.createElement('strong');
            name.textContent = r.name;
            head.append(name);
            if (r === best && savings >= 1) {
                const badge = document.createElement('span');
                badge.className = 'strategy-badge';
                badge.textContent = `Saves ${money(savings)}`;
                head.append(badge);
            }

            const rule = document.createElement('p');
            rule.className = 'strategy-rule';
            rule.textContent = r.rule;

            const stats = document.createElement('dl');
            stats.className = 'strategy-stats';
            [['Debt-free in', `${duration(r.months)} (${finishDate(r.months)})`], ['Total interest', money(r.interest)]].forEach(([k, v]) => {
                const dt = document.createElement('dt');
                dt.textContent = k;
                const dd = document.createElement('dd');
                dd.textContent = v;
                stats.append(dt, dd);
            });

            // A bar per debt showing when it's cleared, on a shared time scale.
            const timeline = document.createElement('ol');
            timeline.className = 'payoff-order';
            r.paidOff.forEach((p) => {
                const li = document.createElement('li');
                const label = document.createElement('span');
                label.textContent = `${p.name}: month ${p.month}`;
                const bar = document.createElement('span');
                bar.className = 'payoff-bar';
                bar.style.width = `${(p.month / longest) * 100}%`;
                li.append(label, bar);
                timeline.append(li);
            });

            card.append(head, rule, stats, timeline);
            return card;
        }));

        // The what-if from the real app: what an extra $100 a month would do.
        const extra = simulate(best, budget + 100);
        const sooner = best.months - extra.months;
        tip.textContent = sooner > 0
            ? `What if: another $100 a month makes you debt-free ${duration(sooner)} sooner and saves ${money(best.interest - extra.interest)} more in interest.`
            : '';
        status.textContent = savings >= 1
            ? `${best.name} saves ${money(savings)} in interest at ${money(budget)}/month`
            : `Both strategies cost the same at ${money(budget)}/month`;
    }

    budgetInput.addEventListener('input', render);
    render();
});
