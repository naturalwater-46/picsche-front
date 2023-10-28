import React from 'react';

const EventList = ({ events, onClose, onEditEvent }) => {
    return (
        <div>
            <h2>予定一覧</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={event.id} onClick={() => onEditEvent(event)}>
                        タイトル: {event.title} <br />
                        場所: {event.extendedProps && event.extendedProps.location ? event.extendedProps.location : '情報がありません'} <br />
                        開始日程: {event.startStr ? event.startStr.split("T")[0] : "日時情報がありません"} <br />
                        開始時間: {event.startStr ? event.startStr.split("T")[1].split(":").slice(0, 2).join(":") : "日時情報がありません"} <br />
                        終了日程: {event.endStr ? event.endStr.split("T")[0] : "日時情報がありません"} <br />
                        終了時間: {event.endStr ? event.endStr.split("T")[1].split(":").slice(0, 2).join(":") : "日時情報がありません"} <br />
                        URL: {event.extendedProps && event.extendedProps.url ? event.extendedProps.url : '情報がありません'} <br />
                        メモ: {event.extendedProps && event.extendedProps.memo ? event.extendedProps.memo : '情報がありません'} <br />
                        {index !== events.length - 1 && <hr />} {/* 区切り線 */}
                    </li>
                ))}
            </ul>
            <button onClick={onClose}>閉じる</button>
        </div>
    );
};

export default EventList;
