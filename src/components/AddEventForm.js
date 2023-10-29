import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase';



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
    background-color: #ddd;
  }
  margin-left: 10px;
`;

const StyledInputFile = styled.input`
  margin-top: 25px;
`;

const DateAndTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HalfWidthField = styled(FormField)`

`;



function AddEventForm({ onClose, onAddEvent }) {
  const [imageCount, setImageCount] = useState(1);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const imageRef = useRef(null);
  const [events, setEvents] = useState([]);


  const handleImageUpload = () => {
    const imageFiles = imageRef.current.files;
    const count = Math.min(imageFiles.length, 5);
    setImageCount(count);
    setCurrentFormIndex(0);
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    const startDate = `${e.target.date.value}T${e.target.startTime.value}`;
    const endDate = `${e.target.endDate.value}T${e.target.endTime.value}`;

    const newEvent = {
        title: e.target.title.value,
        start: startDate,
        end: endDate,
        extendedProps: {
          location: e.target.location.value,
          url: e.target.url.value,
          memo: e.target.memo.value,
        }
      };
      
    console.log(newEvent); 


    const imageFiles = imageRef.current.files;
    if (imageFiles.length > 5) {
      alert("最大5つの画像までしかアップロードできません。");
      return;
    } const imageUrls = [];

    if (imageFiles && imageFiles.length) {
      for (let i = 0; i < imageFiles.length; i++) {
        const storageRef = ref(storage, `event-images/${imageFiles[i].name}`);
        await uploadBytes(storageRef, imageFiles[i]);
        const imageUrl = await getDownloadURL(storageRef);
        imageUrls.push(imageUrl);
      }
      newEvent.imageUrls = imageUrls;
    }
    setCurrentFormIndex((prevIndex) => prevIndex + 1);

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    

    if (currentFormIndex >= imageCount - 1) {
      updatedEvents.forEach(event => onAddEvent(event));
      setEvents([]);
      onClose();
      setImageCount(0);
    }
    

    
  };

  return (
    <ModalBackground>
      {Array.from({ length: imageCount }).map((_, index) => (
        <ModalContainer key={index} style={{ display: index === currentFormIndex ? 'block' : 'none' }}>
          <div>{index + 1}/{imageCount}</div>
          <form onSubmit={handleSubmit}>
            <FormField>
              <label>画像をアップロードして自動予定登録
                <StyledInputFile type="file" ref={imageRef} multiple onChange={handleImageUpload} />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledInput type="text" name="title" required placeholder="タイトルを入力" />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledInput type="text" name="location" placeholder="場所を入力" />
              </label>
            </FormField>

            <DateAndTimeContainer>
              <HalfWidthField>
                <label>開始日付
                  <StyledInput type="date" name="date" required />
                </label>
              </HalfWidthField>

              <HalfWidthField>
                <label>開始時間
                  <StyledInput type="time" name="startTime" required />
                </label>
              </HalfWidthField>
            </DateAndTimeContainer>

            <DateAndTimeContainer>
              <HalfWidthField>
                <label>終了日付
                  <StyledInput type="date" name="endDate" required />
                </label>
              </HalfWidthField>

              <HalfWidthField>
                <label>終了時間
                  <StyledInput type="time" name="endTime" required />
                </label>
              </HalfWidthField>
            </DateAndTimeContainer>


            <FormField>
              <label>
                <StyledInput type="url" name="url" placeholder="URLを入力" />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledTextArea name="memo" placeholder="メモを入力"></StyledTextArea>
              </label>
            </FormField>

            <FormField>
              <StyledButton type="submit">追加</StyledButton>
              <CancelButton type="button" onClick={onClose}>キャンセル</CancelButton>
            </FormField>
          </form>
        </ModalContainer>
      ))}
    </ModalBackground>
  );
}



export default AddEventForm;