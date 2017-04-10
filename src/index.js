import React from 'react';
import { render } from 'react-dom';

const CurrentAction = props => {
    const { action } = props;
    const text = action ? action.minute + "分 " + action.name + (action.note ? " (" + action.note + ")" : "") : "";
    return (
        <div>現: {text}</div>
    );
};

const NextAction = props => {
    const { action, date } = props;
    const text = (() => {
        if (action) {
            const { name, minute } = action;
            const second = action.second ? action.second : 0;
            const m = date.getMinutes();
            const s = date.getSeconds();

            const restTotalSeconds = (minute * 60 + second) - (m * 60 + s);
            const restMinute = Math.floor(restTotalSeconds / 60);
            const restSeconds = restTotalSeconds % 60;
            return minute + "分" + (second != 0 ? (second + "秒 ") : " ") + name + " (" + restMinute + ":" + ("0" + restSeconds).slice(-2) + ")"
        } else {
            return "";
        }
    })();

    return (
        <div className="small">次: {text}</div>
    );
}

const Exceeds = props => {
    const { data, date } = props;

    const extract = (data, date) => {
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const actions = data.actions;

        let i = 0;
        for(; i < actions.length; i++) {
            const m = actions[i].minute;
            const s = actions[i].second ? actions[i].second : 0;
            if(minute * 60 + second < m * 60 + s) break;
        }

        const current = 0 <= i - 1 && i - 1 < actions.length ? actions[i - 1] : undefined;
        const next = 0 <= i && i < actions.length ? actions[i] : undefined;

        return { current, next };
    };

    const { current, next } = extract(data, date);

    return (
        <div>
            <h3>{data.title}</h3>
            <p>現在時刻: {date.toLocaleTimeString()}</p>
            <CurrentAction action={current} />
            <NextAction action={next} date={date} />
        </div>
    );
};

setInterval(() => {
    const date = new Date();
    render(<Exceeds data={data} date={date} />, document.getElementById('app'));
}, 100);
