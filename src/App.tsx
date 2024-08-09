import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CREATE_USER } from "./domains/user/mutation/user";
import { GET_ALL_USERS } from "./domains/user/query/user";
interface User {
	id: number;
	username: string;
	age: number;
}
function App() {
	const { data, loading, refetch } = useQuery(GET_ALL_USERS);
	const [newUser] = useMutation(CREATE_USER);
	const userNameRef = useRef<HTMLInputElement>(null);
	const userAgeRef = useRef<HTMLInputElement>(null);
	const [users, setUsers] = useState<User[] | []>([]);
	useEffect(() => {
		if (!loading) {
			setUsers(data.getAllUsers);
		}
	}, [data]);

	const createUser = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const username = userNameRef.current?.value;
		const age = userAgeRef.current?.value;
		newUser({
			variables: {
				input: {
					username,
					age: Number(age),
				},
			},
		}).then(res => console.log("res.data", res.data));
		userNameRef.current!.value = "";
		userAgeRef.current!.value = "";
		console.log(username, age);
	};

	return (
		<div>
			<form onSubmit={createUser}>
				<input ref={userNameRef} type="text" />
				<input ref={userAgeRef} type="number" />
				<div className="btns">
					<button>Создать</button>
				</div>
			</form>
			<button onClick={() => refetch()}>Получить</button>
			<div>
				{users &&
					users.map(user => (
						<div key={user.id} className="user">
							{user.id}. {user.username} {user.age}
						</div>
					))}
			</div>
		</div>
	);
}

export default App;
