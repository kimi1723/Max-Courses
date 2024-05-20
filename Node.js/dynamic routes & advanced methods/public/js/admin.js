const deleteBtn = document.getElementById('delete-btn');

const deleteProduct = async () => {
	const parentDiv = deleteBtn.parentNode;
	const productId = parentDiv.querySelector('[name=productId]').value;
	const csrfToken = parentDiv.querySelector('[name=_csrf').value;
	const article = deleteBtn.closest('article');

	try {
		const res = await fetch(`/admin/product/${productId}`, {
			method: 'DELETE',
			headers: {
				'csrf-token': csrfToken,
			},
		});

		article.remove();
		console.log(res);
	} catch (err) {
		console.log(err);
	}
};

deleteBtn.addEventListener('click', deleteProduct);
