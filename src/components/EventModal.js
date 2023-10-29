import React, { useState } from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
`;

const FormField = styled.div`
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const StyledTextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  resize: vertical;
`;

const StyledButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const CancelButton = styled(StyledButton)`
  &:hover {
    background-color: #c82333;
  }
  margin-left: 10px;
`;

const DateAndTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HalfWidthField = styled(FormField)`
  width: 48%;
`;


function EventModal({ event, onClose, onDelete, onEdit }) {

    console.log(event.startStr, event.endStr);

    const [editedTitle, setEditedTitle] = useState(event.title);
    const [editedLocation, setEditedLocation] = useState(event.extendedProps.location || '');
    const [editedDate, setEditedDate] = useState(event.startStr.split("T")[0]);
    const [editedStartTime, setEditedStartTime] = useState(event.startStr ? event.startStr.split("T")[1].split(":").slice(0, 2).join(":") : "");
    const [editedEndDate, setEditedEndDate] = useState(event.endStr ? event.endStr.split("T")[0] : "");
    const [editedEndTime, setEditedEndTime] = useState(event.endStr ? event.endStr.split("T")[1].split(":").slice(0, 2).join(":") : "");
    const [editedUrl, setEditedUrl] = useState(event.extendedProps.url || '');
    const [editedMemo, setEditedMemo] = useState(event.extendedProps.memo || '');

    const handleEditSubmit = (e) => {
        e.preventDefault();

        const editedEventData = {
            id: event.id,
            title: editedTitle,
            start: `${editedDate}T${editedStartTime}`,
            end: `${editedEndDate}T${editedEndTime}`,
            extendedProps: {
                location: editedLocation,
                url: editedUrl,
                memo: editedMemo,
            }
        };
        console.log("Edited Event Data:", editedEventData);
        onEdit(editedEventData);
    };
    const handleUrlChange = e => {
        const newUrl = e.target.value;
        console.log("New URL:", newUrl);
        setEditedUrl(newUrl);
    };

    return (
        <ModalBackground>
            <ModalContainer>
                <h2>予定詳細</h2>
                <form onSubmit={handleEditSubmit}>
                    <FormField>
                        <label>
                            <StyledInput
                                type="text"
                                value={editedTitle}
                                onChange={e => setEditedTitle(e.target.value)} placeholder="タイトルを入力"
                            />
                        </label>
                    </FormField>

                    <FormField>
                        <label>
                            <StyledInput
                                type="text"
                                value={editedLocation}
                                onChange={e => setEditedLocation(e.target.value)} placeholder="場所を入力"
                            />
                        </label>
                    </FormField>

                    <DateAndTimeContainer>
                        <HalfWidthField>
                            <label>開始日
                                <StyledInput
                                    type="date"
                                    value={editedDate}
                                    onChange={e => setEditedDate(e.target.value)}
                                />
                            </label>
                        </HalfWidthField>

                        <HalfWidthField>
                            <label>開始時間
                                <StyledInput
                                    type="time"
                                    value={editedStartTime}
                                    onChange={e => setEditedStartTime(e.target.value)}
                                />
                            </label>
                        </HalfWidthField>
                    </DateAndTimeContainer>

                    <DateAndTimeContainer>
                        <HalfWidthField>
                            <label>終了日付
                                <StyledInput
                                    type="date"
                                    value={editedEndDate}
                                    onChange={e => setEditedEndDate(e.target.value)}
                                />
                            </label>
                        </HalfWidthField>

                        <HalfWidthField>
                            <label>終了時間
                                <StyledInput
                                    type="time"
                                    value={editedEndTime}
                                    onChange={e => setEditedEndTime(e.target.value)}
                                />
                            </label>
                        </HalfWidthField>
                    </DateAndTimeContainer>



                    <FormField>
                        <label>
                            <StyledInput
                                type="url"
                                value={editedUrl}
                                onChange={handleUrlChange} placeholder="URLを入力"
                            />
                        </label>
                    </FormField>

                    <FormField>
                        <label>
                            <StyledTextArea
                                value={editedMemo}
                                onChange={e => setEditedMemo(e.target.value)} placeholder="メモを入力"
                            ></StyledTextArea>
                        </label>
                    </FormField>

                    <FormField>
                        <StyledButton type="submit">編集保存</StyledButton>
                        <CancelButton onClick={onDelete}>予定を削除</CancelButton>
                    </FormField>
                </form>

                {event.extendedProps.imageUrl && (
                    <div>
                        <h3>アップロードされた画像</h3>
                        <img src={event.extendedProps.imageUrl} alt="Uploaded for the event" style={{ maxWidth: '300px' }} />
                    </div>
                )}
                <CancelButton onClick={onClose}>閉じる</CancelButton>
            </ModalContainer>
        </ModalBackground>
    );
};

export default EventModal;
