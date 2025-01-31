import axios from "axios";
import React, { useEffect, useState } from "react";
import { LoginContainer, LoginInner, LoginSection } from "./Login";
import { BtBox, Btn } from "./Add";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Log } from "./All";

const Edit = () => {
  const { id } = useParams(); // URL 파라미터에서 ID 가져오기
  const navigate = useNavigate();
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const isLoggedIn = !!localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    alert("로그아웃 되었습니다.");
    navigate("/login");
    // 필요에 따라 리디렉션 처리
  };
  useEffect(() => {
    const fetchContact = async () => {
      if (!id) {
        console.error("Invalid ID");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/contacts/${id}`
        );
        setContact(response.data);
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    fetchContact();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/contacts/${id}`, contact);
      navigate("/all"); // 수정 후 홈으로 리디렉션
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <LoginSection>
      {isLoggedIn ? (
        <Log>
          <button onClick={handleLogout}>로그아웃</button>
        </Log>
      ) : (
        <Log>
          <Link to="/login">로그인</Link>
        </Log>
      )}
      <LoginContainer>
        {isLoggedIn ? (
          <>
            <BtBox className="button-box">
              <Link to="/all" className="btn btn-light">
                <i className="fa-solid fa-list"></i>연락처 목록
              </Link>
            </BtBox>
            <LoginInner>
              <h1>Update Data</h1>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={contact.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={contact.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Btn type="submit">Update</Btn>
              </form>
            </LoginInner>
          </>
        ) : (
          <div>로그인해주세요</div>
        )}
      </LoginContainer>
    </LoginSection>
  );
};

export default Edit;
