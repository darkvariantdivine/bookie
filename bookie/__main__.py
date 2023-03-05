
import uvicorn

from bookie import web_app, config


if __name__ == '__main__':
    uvicorn.run(web_app, **config)
