from zyndai_agent.agent import ZyndAIAgent, AgentConfig
from resume_parser import parse_resume
import json

config = AgentConfig(name="resume-agent", webhook_port=5001)
agent = ZyndAIAgent(agent_config=config)

async def handle_message(message):
    data = json.loads(message.content)
    result = await parse_resume(data["pdf_base64"])
    return json.dumps(result)

agent.add_message_handler(handle_message)
