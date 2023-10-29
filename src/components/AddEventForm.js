import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";

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

const HalfWidthField = styled(FormField)``;

//こっから新しいスタイルコンポーネント
const FirstStyle = styled.div`
  display: flex;
  flex-flow: column;
  row-gap: 30px;
`;

/**
 * ここから
 * 関数
 * 初め
 */
function AddEventForm({ onClose, onAddEvent }) {
  const [contentValue, setContentValue] = useState({
    title: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    place: "",
    url: "",
    memo: "",
  });

  const [manyValue, setManyValue] = useState([])

  const [content, setContent] = useState(null);
  const [manyContents, setManyContents] = useState(null);

  const [imageCount, setImageCount] = useState(1);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);

  const imageRef = useRef(null);
  const [events, setEvents] = useState([]);

  //form関連
  const [form, setForm] = useState(0);
  const toOne = () => {
    setForm(1);
  };
  const toTwo = () => {
    setForm(2);
  };

  useEffect(() => {
    if (content) {
      if (content.date) {
        // 入力文字列
        const dateString = content.date;

        // 現在の年を取得
        var currentYear = new Date().getFullYear();

        // 日付を年を含む形式に変換
        var dateParts = dateString.split("-");
        var fullDate = currentYear + "-" + dateParts[0] + "-" + dateParts[1];

        content.date = fullDate;
        content.start_date = fullDate;
        content.end_date = fullDate;
      }

      content.memo = "";

      setContentValue(content);
      setForm(4);
    }
  }, [content]);
  useEffect(() => {
    if (manyContents) {
      const defultArry = manyContents
      const fixArry = defultArry.map(element => {
        if (element.date) {
          // 入力文字列
          const dateString = element.date;
  
          // 現在の年を取得
          var currentYear = new Date().getFullYear();
  
          // 日付を年を含む形式に変換
          var dateParts = dateString.split("-");
          var fullDate = currentYear + "-" + dateParts[0] + "-" + dateParts[1];
  
          element.date = fullDate;
          element.start_date = fullDate;
          element.end_date = fullDate;
        }
  
        element.memo = "";

        return element
      })

      setManyValue(fixArry)
      setForm(5)


    }
  }, [manyContents]);

  //contentsvalue
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContentValue({
      ...contentValue,
      [name]: value,
    });
  };
  const handleChangeMany = (e,index) => {
    const { name, value } = e.target;
    const manyValueCopy = [...manyValue];
    
    manyValueCopy[index] = {
      ...manyValue[index],
      [name]: value,
    }
    setManyValue(manyValueCopy)
  };

  const pushImage = async (e) => {
    setForm(3);
    e.preventDefault();
    const imageFiles = imageRef.current.files;
    const count = Math.min(imageFiles.length, 5);
    setImageCount(count);
    setCurrentFormIndex(0);

    if (imageFiles.length > 5) {
      alert("最大5つの画像までしかアップロードできません。");
      return;
    }

    console.log(imageFiles);

    const fileData = new FormData();

    if (imageFiles.length === 1) {
      try {
        fileData.append("image", imageFiles[0]);
        const result = await axios.post(
          "https://picsche-api-app-g2nbew2csq-an.a.run.app/oneimage",
          fileData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        );

        console.log(result.data);
        setContent(result.data);
      } catch (e) {
        console.log(e);
        alert("エラーが発生しました。やり直してください。");
      }
    }

    if (imageFiles.length > 1) {
      try {
        for (let i = 0; i < imageFiles.length; i++) {
          fileData.append("images", imageFiles[i]);
        }
        console.log(fileData);
        const result = await axios.post(
          "https://picsche-api-app-g2nbew2csq-an.a.run.app/multipleimages",
          fileData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        );

        setManyContents(result.data);
      } catch (e) {
        console.log(e);
        alert("エラーが発生しました。やり直してください。");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = `${e.target.start_date.value}T${e.target.start_time.value}`;
    const endDate = `${e.target.end_date.value}T${e.target.end_time.value}`;

    const newEvent = {
      title: e.target.title.value,
      start: startDate,
      end: endDate,
      location: e.target.place.value,
      url: e.target.url.value,
      memo: e.target.memo.value,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    updatedEvents.forEach((event) => onAddEvent(event));
    setEvents([]);
    onClose();
    setImageCount(0);

  };

  const handleSubmitMany = async (e) => {
    e.preventDefault();

    const startDate = `${e.target.start_date.value}T${e.target.start_time.value}`;
    const endDate = `${e.target.end_date.value}T${e.target.end_time.value}`;

    const newEvent = {
      title: e.target.title.value,
      start: startDate,
      end: endDate,
      location: e.target.place.value,
      url: e.target.url.value,
      memo: e.target.memo.value,
    };

    console.log(newEvent);

  setCurrentFormIndex((prevIndex) => prevIndex + 1);

  const updatedEvents = [...events, newEvent];
  setEvents(updatedEvents);

  if (currentFormIndex >= imageCount - 1) {
    updatedEvents.forEach((event) => onAddEvent(event));
    setEvents([]);
    onClose();
    setImageCount(0);
  }
  };

  return (
    <ModalBackground>
      {form === 0 && (
        <ModalContainer>
          <FirstStyle>
            <StyledButton onClick={toOne}>画像から入力</StyledButton>
            <StyledButton onClick={toTwo}>手入力</StyledButton>
            <CancelButton type="button" onClick={onClose}>
              キャンセル
            </CancelButton>
          </FirstStyle>
        </ModalContainer>
      )}

      {form === 1 && (
        <ModalContainer>
          <form onSubmit={pushImage}>
            <FormField>
              <label>
                画像をアップロードして自動予定登録
                <StyledInputFile type="file" ref={imageRef} multiple />
              </label>
            </FormField>
            <StyledButton type="submit">画像アップロード</StyledButton>
          </form>
          <CancelButton type="button" onClick={onClose}>
            キャンセル
          </CancelButton>
        </ModalContainer>
      )}
      {form === 3 && (
        <ModalContainer>
          <h3>情報を解析中です。しばらくお待ちください</h3>
        </ModalContainer>
      )}

      {form === 4 && contentValue && (
        <ModalContainer>
          <form onSubmit={handleSubmit}>
            <FormField>
              <label>
                <StyledInput
                  type="text"
                  name="title"
                  value={contentValue.title}
                  onChange={handleChange}
                  required
                  placeholder="タイトルを入力"
                />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledInput
                  type="text"
                  value={contentValue.place}
                  onChange={handleChange}
                  name="place"
                  placeholder="場所を入力"
                />
              </label>
            </FormField>

            <DateAndTimeContainer>
              <HalfWidthField>
                <label>
                  開始日付
                  <StyledInput
                    type="date"
                    value={contentValue.start_date}
                    onChange={handleChange}
                    name="start_date"
                    required
                  />
                </label>
              </HalfWidthField>

              <HalfWidthField>
                <label>
                  開始時間
                  <StyledInput
                    type="time"
                    value={contentValue.start_time}
                    onChange={handleChange}
                    name="start_time"
                  />
                </label>
              </HalfWidthField>
            </DateAndTimeContainer>

            <DateAndTimeContainer>
              <HalfWidthField>
                <label>
                  終了日付
                  <StyledInput
                    type="date"
                    name="end_date"
                    value={contentValue.end_date}
                    onChange={handleChange}
                    required
                  />
                </label>
              </HalfWidthField>

              <HalfWidthField>
                <label>
                  終了時間
                  <StyledInput
                    type="time"
                    value={contentValue.end_time}
                    onChange={handleChange}
                    name="end_time"
                  />
                </label>
              </HalfWidthField>
            </DateAndTimeContainer>

            <FormField>
              <label>
                <StyledInput
                  type="url"
                  name="url"
                  value={contentValue.url}
                  onChange={handleChange}
                  placeholder="URLを入力"
                />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledTextArea
                  name="memo"
                  value={contentValue.memo}
                  onChange={handleChange}
                  placeholder="メモを入力"
                ></StyledTextArea>
              </label>
            </FormField>

            <FormField>
              <StyledButton type="submit">追加</StyledButton>
              <CancelButton type="button" onClick={onClose}>
                キャンセル
              </CancelButton>
            </FormField>
          </form>
        </ModalContainer>
      )}

      {form === 2 && contentValue && (
        <ModalContainer>
          <form onSubmit={handleSubmit}>
            <FormField>
              <label>
                <StyledInput
                  type="text"
                  name="title"
                  value={contentValue.title}
                  onChange={handleChange}
                  required
                  placeholder="タイトルを入力"
                />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledInput
                  type="text"
                  value={contentValue.place}
                  onChange={handleChange}
                  name="place"
                  placeholder="場所を入力"
                />
              </label>
            </FormField>

            <DateAndTimeContainer>
              <HalfWidthField>
                <label>
                  開始日付
                  <StyledInput
                    type="date"
                    value={contentValue.start_date}
                    onChange={handleChange}
                    name="start_date"
                    required
                  />
                </label>
              </HalfWidthField>

              <HalfWidthField>
                <label>
                  開始時間
                  <StyledInput
                    type="time"
                    value={contentValue.start_time}
                    onChange={handleChange}
                    name="start_time"
                  />
                </label>
              </HalfWidthField>
            </DateAndTimeContainer>

            <DateAndTimeContainer>
              <HalfWidthField>
                <label>
                  終了日付
                  <StyledInput
                    type="date"
                    name="end_date"
                    value={contentValue.end_date}
                    onChange={handleChange}
                    required
                  />
                </label>
              </HalfWidthField>

              <HalfWidthField>
                <label>
                  終了時間
                  <StyledInput
                    type="time"
                    value={contentValue.end_time}
                    onChange={handleChange}
                    name="end_time"
                  />
                </label>
              </HalfWidthField>
            </DateAndTimeContainer>

            <FormField>
              <label>
                <StyledInput
                  type="url"
                  name="url"
                  value={contentValue.url}
                  onChange={handleChange}
                  placeholder="URLを入力"
                />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledTextArea
                  name="memo"
                  value={contentValue.memo}
                  onChange={handleChange}
                  placeholder="メモを入力"
                ></StyledTextArea>
              </label>
            </FormField>

            <FormField>
              <StyledButton type="submit">追加</StyledButton>
              <CancelButton type="button" onClick={onClose}>
                キャンセル
              </CancelButton>
            </FormField>
          </form>
        </ModalContainer>
      )}

      {
        form === 5 && manyValue.length > 0 && (
          
        Array.from({ length: imageCount }).map((_, index) => (
            <ModalContainer key={index} style={{ display: index === currentFormIndex ? 'block' : 'none' }}>
              <div>{index + 1}/{imageCount}</div>
    
              <form onSubmit={handleSubmitMany}>
                           <FormField>
              <label>
                <StyledInput
                  type="text"
                  name="title"
                  value={manyValue[index].title}
                  onChange={(e) =>handleChangeMany(e,index)}
                  required
                  placeholder="タイトルを入力"
                />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledInput
                  type="text"
                  value={manyValue[index].place}
                  onChange={(e) =>handleChangeMany(e,index)}
                  name="place"
                  placeholder="場所を入力"
                />
              </label>
            </FormField>

            <DateAndTimeContainer>
              <HalfWidthField>
                <label>
                  開始日付
                  <StyledInput
                    type="date"
                    value={manyValue[index].start_date}
                    onChange={(e) =>handleChangeMany(e,index)}
                    name="start_date"
                    required
                  />
                </label>
              </HalfWidthField>

              <HalfWidthField>
                <label>
                  開始時間
                  <StyledInput
                    type="time"
                    value={manyValue[index].start_time}
                    onChange={(e) =>handleChangeMany(e,index)}
                    name="start_time"
                  />
                </label>
              </HalfWidthField>
            </DateAndTimeContainer>

            <DateAndTimeContainer>
              <HalfWidthField>
                <label>
                  終了日付
                  <StyledInput
                    type="date"
                    name="end_date"
                    value={manyValue[index].end_date}
                    onChange={(e) =>handleChangeMany(e,index)}
                    required
                  />
                </label>
              </HalfWidthField>

              <HalfWidthField>
                <label>
                  終了時間
                  <StyledInput
                    type="time"
                    value={manyValue[index].end_time}
                    onChange={(e) =>handleChangeMany(e,index)}
                    name="end_time"
                  />
                </label>
              </HalfWidthField>
            </DateAndTimeContainer>

            <FormField>
              <label>
                <StyledInput
                  type="url"
                  name="url"
                  value={manyValue[index].url}
                  onChange={(e) =>handleChangeMany(e,index)}
                  placeholder="URLを入力"
                />
              </label>
            </FormField>

            <FormField>
              <label>
                <StyledTextArea
                  name="memo"
                  value={manyValue[index].memo}
                  onChange={(e) =>handleChangeMany(e,index)}
                  placeholder="メモを入力"
                ></StyledTextArea>
              </label>
            </FormField>

            <FormField>
              <StyledButton type="submit">追加</StyledButton>
              <CancelButton type="button" onClick={onClose}>
                キャンセル
              </CancelButton>
            </FormField>
              </form>
            </ModalContainer>
          ))
        )
      }

    </ModalBackground>
  );
}

export default AddEventForm;
