import React, { useCallback, useState, VFC } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';

import useInput from '@hooks/useInput';
import { postData } from '@utils/rest';
import useStore from '@hooks/useStore';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/signup/styles';

const SignUp: VFC = () => {
  const { UserData } = useStore();

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!mismatchError && nickname) {
        setSignUpError('');
        setSignUpSuccess(false);
        try {
          const response = await postData('http://localhost:3095/api/users', {
            email,
            nickname,
            password,
          });
          setSignUpSuccess(true);
        } catch (error) {
          console.log('[SignUp] error: ', error.response);
          setSignUpError(error.response.data);
        }
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

  if (UserData.myData === undefined) {
    return <div>로딩중...</div>;
  }

  if (UserData.myData) {
    const workspace_url = UserData.myData.Workspaces[0].url;
    const redirect = `/workspace/${workspace_url}/channel/일반`;
    return <Redirect to={redirect} />;
  }

  return (
    <div id="container">
      <Header>React Slack</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default observer(SignUp);
