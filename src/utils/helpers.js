const getCookieValue = (name) => {
  const cookies = document.cookie.split(';');

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    // Check if the cookie starts with the specified name
    if (cookie.startsWith(`${name}=`)) {
      // Extract and return the cookie value
      return cookie.substring(name.length + 1);
    }
  }

  // Return null if cookie not found
  return null;
};

export { getCookieValue };
