namespace FotoPuzleBackend.Models.DTO
{
    /// <summary>
    /// Represents the data required to register a new user account, when getting data from DB, in the back we put the info into a DTO object,
    /// we also get DTO objects from frontend
    /// </summary>
    public class RegisterDTO
    {
        public string Name { set; private get; }
        public string Surname { set; private get; }

    }
}
