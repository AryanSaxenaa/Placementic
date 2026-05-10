from zyndai_agent.agent import ZyndAIAgent, AgentConfig
from jd_decoder import decode_jd
import json

config = AgentConfig(name="jd-agent", webhook_port=5002)
agent = ZyndAIAgent(agent_config=config)

async def handle_message(message):
    data = json.loads(message.content)
    result = await decode_jd(data["jd_text"])
    return json.dumps(result)

agent.add_message_handler(handle_message)
