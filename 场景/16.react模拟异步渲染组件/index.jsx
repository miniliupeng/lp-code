function AsyncComponent(Component, api) {
  const AsyncComponentPromise = () =>
    new Promise(async (resolve) => {
      const data = await api();
      resolve({
        default: (props) => <Component data={data} {...props} />
      });
    });

  return React.lazy(AsyncComponentPromise);
}
