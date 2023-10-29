import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    auth, googleProvider, signInWithPopup, signInWithEmailAndPassword
} from '../firebase';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import gLogo from './image/g-logo.png';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    width: 90%;
    max-width: 300px;
    margin: 100px auto;

    @media (min-width: 768px) {
        width: 60%;
    }

    @media (min-width: 992px) {
        width: 40%;
    }

    @media (min-width: 1200px) {
        width: 30%;
    }
`;

const Title = styled.h1`
    font-size: 40px;
    margin-bottom: 20px;
    color: #333;
`;

const StyledButton = styled.button`
    margin: 10px 0;
    padding: 10px 20px;
    border: 2px solid #000; 
    background-color: #fff; 
    border-radius: 5px;
    width: 75%;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #ddd;
    }
`;

const InputField = styled.input`
    margin: 5px 0;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
    font-size: 16px;
`;


const StyledGoogleLogo = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: middle;
    &:hover {
        background-color: #ddd;
    }
`;


const StyledLink = styled(Link)`
    margin-top: 20px;
    text-decoration: none;
    color: #0077cc;
    &:hover {
        text-decoration: underline;
    }
`;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert('Googleでログインに成功しました！');
            navigate("/calendar");
        } catch (error) {
            switch (error.code) {
                case 'auth/account-exists-with-different-credential':
                    alert('既に別のログイン方法でアカウントが存在します。');
                    break;
                case 'auth/auth-domain-config-required':
                    alert('Googleログインが正しく設定されていません。サポートにお問い合わせください。');
                    break;
                case 'auth/cancelled-popup-request':
                    alert('ログインポップアップがキャンセルされました。再試行してください。');
                    break;
                case 'auth/popup-blocked':
                    alert('ポップアップがブロックされました。ポップアップの許可をしてから再試行してください。');
                    break;
                case 'auth/popup-closed-by-user':
                    alert('ポップアップが閉じられました。再試行してください。');
                    break;
                case 'auth/unauthorized-domain':
                    alert('このドメインはGoogleログインの許可リストにありません。サポートにお問い合わせください。');
                    break;
                default:
                    alert('予期しないエラーが発生しました。再試行するか、サポートにお問い合わせください。');
                    console.error("Googleログインに失敗:", error.message);
                    break;
            }
        }
    };

    const handleEmailPasswordLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('ログインに成功しました！');
            navigate("/calendar");
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    alert('無効なメールアドレスです。');
                    break;
                case 'auth/user-disabled':
                    alert('このアカウントは無効になっています。サポートにお問い合わせください。');
                    break;
                case 'auth/user-not-found':
                    alert('アカウントが存在しないか、パスワードが間違っています。');
                    break;
                case 'auth/wrong-password':
                    alert('正しいパスワードを入力してください。');
                    break;
                default:
                    alert('予期しないエラーが発生しました。再試行するか、サポートにお問い合わせください。');
                    console.error("メール/パスワードログインに失敗:", error.message);
                    break;
            }
        }
    };

    return (
        <Container>
            <Title>Picsche</Title>
            <InputField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
            />
            <InputField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
            />
            <StyledButton onClick={handleEmailPasswordLogin}>ログイン</StyledButton>
            <StyledButton onClick={handleGoogleLogin}>
                <StyledGoogleLogo src={gLogo} alt="Google Logo" style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Googleでログイン
            </StyledButton>

            <StyledLink to="/signup">アカウントをお持ちでない方はこちら</StyledLink>
        </Container>
    );
}

export default Login;