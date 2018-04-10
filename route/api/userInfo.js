let a = {
  method: "GET",
  path: "/{name}",
  handler: (request, h) => {
    // request.log(['a', 'name'], "Request name");
    // or
    request.logger.info("In handler %s", request.path);
    return { name: `${encodeURIComponent(request.params.name)}` };
  }
}

module.exports = a;
