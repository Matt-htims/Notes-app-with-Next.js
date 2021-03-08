import Link from 'next/link';
import { useState, useEffect, createContext } from 'react';
import fetch from 'isomorphic-unfetch';
import { Button, Form, Loader } from 'semantic-ui-react';

//Can route to different pages using some of nextjs methods
import { useRouter } from 'next/router';

const EditNote = ({ note }) => {
	//  State
	const [form, setForm] = useState({
		title: note.title,
		description: note.description,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const router = useRouter();

	useEffect(() => {
		if (isSubmitting) {
			if (Object.keys(errors).length === 0) {
				updateNote();
			} else {
				setIsSubmitting(false);
			}
		}
	}, [errors]);

	//  Handlers
	const handleSubmit = e => {
		e.preventDefault();
		let errs = validate();
		setErrors(errs);
		setIsSubmitting(true);
	};

	const handleChange = e => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	//  Functions
	const validate = () => {
		let err = {};

		if (!form.title) {
			err.title = 'Title is required';
		}
		if (!form.description) {
			err.description = 'Description is required';
		}

		return err;
	};

	const updateNote = async () => {
		try {
			const res = await fetch(
				`http://localhost:3000/api/notes/${router.query.id}`,
				{
					method: 'PUT',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(form),
				}
			);
			router.push('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="form-container">
			<h1>Update Note</h1>
			<div>
				{isSubmitting ? (
					<Loader active inline="centered" />
				) : (
					<Form onSubmit={handleSubmit}>
						<Form.Input
							fluid
							error={
								errors.title
									? { content: 'Please enter a title', pointing: 'below' }
									: null
							}
							label="Title"
							placeholder="Title"
							name="title"
							onChange={handleChange}
							value={form.title}
						/>
						<Form.TextArea
							fluid
							error={
								errors.description
									? { content: 'Please enter a description', pointing: 'below' }
									: null
							}
							label="Description"
							placeholder="Description"
							name="description"
							onChange={handleChange}
							value={form.description}
						/>
						<Button type="submit">Update</Button>
					</Form>
				)}
			</div>
		</div>
	);
};

export async function getServerSideProps({ query: { id } }) {
	const res = await fetch(`http://localhost:3000/api/notes/${id}`);
	const { data } = await res.json();

	return { props: { note: data } };
}

export default EditNote;
