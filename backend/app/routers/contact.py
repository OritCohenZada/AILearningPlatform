from fastapi import APIRouter, status
from app.schemas import ContactCreate
from app.services import contact_service 

router = APIRouter(
    prefix="/contact",
    tags=["Contact"]
)

@router.post("/", status_code=status.HTTP_200_OK)
def send_contact(contact_data: ContactCreate):
    return contact_service.handle_contact_request(contact_data)